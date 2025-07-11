'use strict';

const {
  ErrorHandler,
  processAttachment
} = require('../../../../../../lib/utils');

const User = require('../../../../../../models/users');
const Assigned = require('../../../../../../models/assigned');
const Pin = require('../../../../../../models/pin');
const Place = require('../../../../../../models/place');
const Menu = require('../../../../../../models/menu_plan');
const Warehouseinformation = require('../../../../../../models/be_warehouse_information');
const Businessareateritary = require('../../../../../../models/business_area_teritari');
const Businessarea = require('../../../../../../models/business_area');
const Businessarearegion = require('../../../../../../models/business_area_region');
const Businessareazone = require('../../../../../../models/business_area_zone');
const Be_info = require('../../../../../../models/assigned_to');
const Gst = require('../../../../../../models/be_gst_details');
const Gst_parson = require('../../../../../../models/be_gst_person_assigned');
const { constants } = require('../../../../../../config');
const getUpwardUserHierarchy1 = require('../../../../../../middlewares/get.user.hierarchy.staff');

module.exports = async (req, res) => {
  try {
    let usersJson = [];
    let allUserIds = [];

    // ============ SUPERADMIN FLOW ============
    if (req.user.id === 1) {
      const userHierarchy = await getUpwardUserHierarchy1(req.user.id);
      const userIdsArray = Array.from(userHierarchy);

      const allUsers = await User.query((qb) => {
        qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
          .andWhere('role', '=', 'user')
          .whereIn('added_by', userIdsArray)
          .orderBy('created_at', 'asc');
      }).fetchAll({ require: false, withRelated: ['staff_photo'] });

      const allUsersJson = allUsers.toJSON();
      allUserIds = allUsersJson.map(user => user.id);

      const assignedDetails = await Assigned.query(qb => {
        qb.whereIn('user_id', allUserIds);
      }).fetchAll({ require: false });

      const assignedJson = assignedDetails.toJSON();
      const assignedUserIds = assignedJson.map(a => a.user_id);

      // Only assigned users
      usersJson = allUsersJson.filter(user => assignedUserIds.includes(user.id));
      allUserIds = usersJson.map(user => user.id); // Filtered IDs only
    }

    // ============ NON-SUPERADMIN FLOW ============
    else {
      const userHierarchy = await getUpwardUserHierarchy1(req.user.id);
      const userIdsArray = Array.from(userHierarchy);
      const beInfos = await Be_info.query(qb => {
        qb.whereIn('user_id', userIdsArray);
      }).fetchAll({ require: false });

      const beInformationIds = beInfos.toJSON().map(b => b.be_information_id);
      console.log("beInformationIds", beInformationIds);

      if (beInformationIds.length === 0) return res.success({ users: [] });

      const gstDetails = await Gst.query(qb => {
        qb.whereIn('be_information_id', beInformationIds)
          .whereIn('active_status', ['active', 'inactive']);
      }).fetchAll({ require: false });


      const gstIds = gstDetails.toJSON().map(g => g.id);
      if (gstIds.length === 0) return res.success({ users: [] });
      console.log("gstIds", gstIds);
      const gstPersons = await Gst_parson.query(qb => {
        qb.whereIn('gst_detail_id', gstIds)
          .andWhere('is_admin', 'yes');
      }).fetchAll({ require: false });


      allUserIds = gstPersons.toJSON().map(gp => gp.user_id);
      console.log("allUserIds", allUserIds);
      const users = await User.query(qb => {
        qb.whereIn('id', allUserIds)
          .andWhere('role', '=', 'user')
          .whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive]);
      }).fetchAll({ require: false, withRelated: ['staff_photo'] });

      usersJson = users.toJSON();
    }

    // ============ COMMON SHARED LOGIC ============

    const assignedDetails = await Assigned.query(qb => {
      qb.whereIn('be_information_id', beInformationIds);
    }).fetchAll({ require: false });

    const assignedJson = assignedDetails.toJSON();

    const warehouseIds = new Set();
    assignedJson.forEach(a => {
      const wids = Array.isArray(a.warehouse_id) ? a.warehouse_id : (a.warehouse_id ? [a.warehouse_id] : []);
      wids.forEach(id => warehouseIds.add(id));
    });

    const [warehouseDetails, pincodeDetails, placeDetails, menuPlanDetails] = await Promise.all([
      Warehouseinformation.where('id', 'IN', Array.from(warehouseIds)).fetchAll({ require: false }),
      Pin.where('id', 'IN', usersJson.map(user => user.pincode_id)).fetchAll({ require: false }),
      Place.where('id', 'IN', usersJson.map(user => user.place_id)).fetchAll({ require: false }),
      Menu.where('id', 'IN', usersJson.map(user => user.menu_plan_id)).fetchAll({ require: false }),
    ]);

    const usersData = await Promise.all(usersJson.map(async user => {
      const assigned = assignedJson.find(a => String(a.user_id) === String(user.id));
      const pincode = pincodeDetails.toJSON().find(p => p.id === user.pincode_id);
      const place = placeDetails.toJSON().find(p => p.id === user.place_id);
      const menuPlan = menuPlanDetails.toJSON().find(m => m.id === user.menu_plan_id);

      // warehouse
      let warehouseData = {};
      if (assigned?.warehouse_id) {
        const widArray = Array.isArray(assigned.warehouse_id) ? assigned.warehouse_id : [assigned.warehouse_id];
        const warehouse = warehouseDetails.toJSON().find(w => w.id === widArray[0]);
        warehouseData = warehouse ? { id: warehouse.id, name: warehouse.name } : {};
      }

      // business area
      let businessAreaData = [];
      if (assigned?.business_area_zone && assigned?.business_area_id) {
        const ids = Array.isArray(assigned.business_area_id) ? assigned.business_area_id : [assigned.business_area_id];
        let model = null;

        switch (assigned.business_area_zone.toLowerCase()) {
          case 'territory': model = Businessareateritary; break;
          case 'area': model = Businessarea; break;
          case 'region': model = Businessarearegion; break;
          case 'zone': model = Businessareazone; break;
        }

        if (model) {
          try {
            const areas = await model.where('id', 'IN', ids).fetchAll({ require: false });
            businessAreaData = areas.toJSON().map(b => ({ id: b.id, name: b.name }));
          } catch (err) {
            console.error("Business area fetch error:", err);
          }
        }
      }

      return {
        ...user,
        staff_photo: processAttachment(user.staff_photo),
        assigned_data: {
          ...assigned,
          warehouse_id: warehouseData,
          business_area_id: businessAreaData
        },
        pincode_id: pincode ? { id: pincode.id, pin_code: pincode.pin_code } : null,
        place_id: place ? { id: place.id, place_name: place.place_name } : null,
        menu_plan_id: menuPlan ? { id: menuPlan.id, menu_name: menuPlan.menu_name } : null
      };
    }));

    return res.success({ users: usersData });

  } catch (error) {
    console.error("Error occurred:", error);
    return res.serverError(500, ErrorHandler(error));
  }
};
