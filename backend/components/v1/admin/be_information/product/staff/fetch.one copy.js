'use strict';
const { ErrorHandler, processAttachment } = require('../../../../../../lib/utils');
const User = require('../../../../../../models/users');
const Assigned = require('../../../../../../models/assigned');
const Assigneds = require('../../../../../../models/assigned_to');
const Pin = require('../../../../../../models/pin');
const Menu = require('../../../../../../models/menu_plan');
const Warehouseinformation = require('../../../../../../models/be_warehouse_information');
const Businessareateritary = require('../../../../../../models/business_area_teritari');
const Businessarea = require('../../../../../../models/business_area');
const Businessarearegion = require('../../../../../../models/business_area_region');
const Businessareazone = require('../../../../../../models/business_area_zone');
const Entitybasic = require('../../../../../../models/be_information'); // Import Entitybasic model

module.exports = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.serverError(400, ErrorHandler('User ID is required'));
    }

    // Fetch user details
    const user = await User.where({ id: user_id }).fetch({
      require: false,
      withRelated: ['staff_photo']
    });

    if (!user) {
      return res.serverError(404, ErrorHandler('User not found'));
    }

    // Fetch assigned details
    const assignedDetails = await Assigned.where({ added_by: user_id }).fetchAll({ require: false });
    const assignedToDetails = await Assigneds.where({ user_id }).fetchAll({ require: false });

    let assigned = assignedDetails ? assignedDetails.toJSON()[0] : null;

    // Fetch pincode details
    let pincode = null;
    if (user.toJSON().pincode_id) {
      pincode = await Pin.where({ id: user.toJSON().pincode_id }).fetch({ require: false });
      pincode = pincode ? pincode.toJSON() : null;
    }

    // Fetch menu plan details
    let menuPlan = null;
    if (user.toJSON().menu_plan_id) {
      menuPlan = await Menu.where({ id: user.toJSON().menu_plan_id }).fetch({ require: false });
      menuPlan = menuPlan ? menuPlan.toJSON() : null;
    }

    // Fetch warehouse details
    let warehouseData = [];
    if (assigned && assigned.warehouse_id) {
      let warehouseArray = Array.isArray(assigned.warehouse_id) ? assigned.warehouse_id : [assigned.warehouse_id];
      const warehouseDetails = await Warehouseinformation.where('id', 'IN', warehouseArray).fetchAll({ require: false });

      warehouseData = warehouseDetails ? warehouseDetails.toJSON().map(w => ({ id: w.id, name: w.name })) : [];
    }

    // Fetch business area details based on `business_area_zone`
    let businessAreaData = [];
    if (assigned && assigned.business_area_zone && assigned.business_area_id) {
      let businessAreaArray = Array.isArray(assigned.business_area_id) ? assigned.business_area_id : [assigned.business_area_id];

      let businessAreaModel;
      switch (assigned.business_area_zone.toLowerCase()) {
        case 'territory':
          businessAreaModel = Businessareateritary;
          break;
        case 'area':
          businessAreaModel = Businessarea;
          break;
        case 'region':
          businessAreaModel = Businessarearegion;
          break;
        case 'zone':
          businessAreaModel = Businessareazone;
          break;
        default:
          businessAreaModel = null;
      }

      if (businessAreaModel) {
        try {
          const fetchedBusinessAreas = await businessAreaModel.where('id', 'IN', businessAreaArray).fetchAll({ require: false });
          businessAreaData = fetchedBusinessAreas.toJSON().map(b => ({ id: b.id, name: b.name }));
        } catch (error) {
          console.error("Error fetching business area data:", error);
        }
      }
    }

    // Fetch be_information details for assigned_to_data
    let assignedToData = assignedToDetails ? assignedToDetails.toJSON() : [];
    let entityIds = assignedToData.map(a => a.be_information_id).filter(Boolean);

    let entityDetails = [];
    if (entityIds.length > 0) {
      const fetchedEntities = await Entitybasic.where('id', 'IN', entityIds).fetchAll({ require: false });
      entityDetails = fetchedEntities ? fetchedEntities.toJSON().map(e => ({ id: e.id, business_name: e.business_name })) : [];
    }

    // Map entity details to assigned_to_data
    assignedToData = assignedToData.map(assignedTo => {
      const entityInfo = entityDetails.find(e => e.id === assignedTo.be_information_id);
      return {
        ...assignedTo,
        be_information_id: entityInfo ? entityInfo : null // Attach business_name
      };
    });

    // Process final response
    let userData = user.toJSON();
    userData.staff_photo = processAttachment(userData.staff_photo);
    userData.pincode_id = pincode ? { id: pincode.id, pin_code: pincode.pin_code } : null;
    userData.menu_plan_id = menuPlan ? { id: menuPlan.id, menu_name: menuPlan.menu_name } : null;
    userData.assigned_data = assigned
      ? {
        ...assigned,
        warehouse_id: warehouseData,
        business_area_id: businessAreaData
      }
      : {};
    userData.assigned_to_data = assignedToData;

    console.log("Final User Data:", JSON.stringify(userData, null, 2));
    return res.success({ user: userData });

  } catch (error) {
    console.error("Error:", error);
    return res.serverError(500, ErrorHandler(error));
  }
};
