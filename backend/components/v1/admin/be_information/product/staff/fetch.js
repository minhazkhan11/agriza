// 'use strict';
// const { ErrorHandler, processAttachment } = require('../../../../../../lib/utils');
// const User = require('../../../../../../models/users');
// const Assigned = require('../../../../../../models/assigned');
// const Assigneds = require('../../../../../../models/assigned_to');
// const Pin = require('../../../../../../models/pin');
// const Place = require('../../../../../../models/place');
// const Menu = require('../../../../../../models/menu_plan');
// const Warehouseinformation = require('../../../../../../models/be_warehouse_information');
// const Businessareateritary = require('../../../../../../models/business_area_teritari');
// const Businessarea = require('../../../../../../models/business_area');
// const Businessarearegion = require('../../../../../../models/business_area_region');
// const Businessareazone = require('../../../../../../models/business_area_zone');
// const { constants } = require('../../../../../../config');
// const getUserHierarchy = require('../../../../../../middlewares/get.user.hierarchy');

// module.exports = async (req, res) => {
//   try {



//     const userHierarchy = await getUserHierarchy(req.user.id); // Get upline users
//     const userIdsArray = Array.from(userHierarchy);
//     console.log('userIdsArray', userIdsArray);
//     const users = await User.query((qb) => {
//       qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
//         .andWhere('role', '=', 'user')
//         // .andWhere('added_by', 'in', main_id)
//         .whereIn('added_by', userIdsArray)
//         .orderBy('created_at', 'asc');
//     }).fetchAll({ require: false, withRelated: ['staff_photo'] });

//     if (!users || users.length === 0) {
//       return res.serverError(404, ErrorHandler('No users found'));
//     }

//     const userIds = users.toJSON().map(user => user.id);
//     const assignedDetails = await Assigned.where('added_by', 'IN', userIds).fetchAll({ require: false });
//     // const assignedToDetails = await Assigneds.where('user_id', 'IN', userIds).fetchAll({ require: false });

//     // Extract warehouse IDs
//     const warehouseIds = new Set();
//     assignedDetails.toJSON().forEach(a => {
//       let warehouseArray = Array.isArray(a.warehouse_id) ? a.warehouse_id : (a.warehouse_id ? [a.warehouse_id] : []);
//       warehouseArray.forEach(id => warehouseIds.add(id));
//     });

//     // Fetch warehouse details
//     const warehouseDetails = await Warehouseinformation.where('id', 'IN', Array.from(warehouseIds)).fetchAll({ require: false });

//     // Fetch pincode details
//     const pincodeDetails = await Pin.where('id', 'IN', users.toJSON().map(user => user.pincode_id)).fetchAll({ require: false });

//     const placeDetails = await Place.where('id', 'IN', users.toJSON().map(user => user.place_id)).fetchAll({ require: false });

//     // Fetch menu plan details
//     const menuPlanDetails = await Menu.where('id', 'IN', users.toJSON().map(user => user.menu_plan_id)).fetchAll({ require: false });

//     // Process user data
//     let usersData = await Promise.all(users.toJSON().map(async user => {
//       const assigned = assignedDetails ? assignedDetails.toJSON().find(a => String(a.added_by) === String(user.id)) : null;
//       // const assignedTo = assignedToDetails ? assignedToDetails.toJSON().find(a => String(a.user_id) === String(user.id)) : null;
//       const pincode = pincodeDetails ? pincodeDetails.toJSON().find(p => p.id === user.pincode_id) : null;
//       const place = placeDetails ? placeDetails.toJSON().find(p => p.id === user.place_id) : null;
//       const menuPlan = menuPlanDetails ? menuPlanDetails.toJSON().find(m => m.id === user.menu_plan_id) : null;

//       // Ensure warehouse_id is properly formatted
//       let warehouseData = {};
//       if (assigned && assigned.warehouse_id) {
//         let warehouseArray = Array.isArray(assigned.warehouse_id) ? assigned.warehouse_id : [assigned.warehouse_id];

//         const warehouse = warehouseDetails ? warehouseDetails.toJSON().find(w => w.id === warehouseArray[0]) : null;

//         warehouseData = warehouse ? { id: warehouse.id, name: warehouse.name } : {};
//       }


//       // Fetch business area details based on business_area_zone
//       let businessAreaData = [];
//       if (assigned && assigned.business_area_zone && assigned.business_area_id) {
//         let businessAreaArray = Array.isArray(assigned.business_area_id) ? assigned.business_area_id : [assigned.business_area_id];

//         let businessAreaModel;
//         switch (assigned.business_area_zone.toLowerCase()) {
//           case 'territory':
//             businessAreaModel = Businessareateritary;
//             break;
//           case 'area':
//             businessAreaModel = Businessarea;
//             break;
//           case 'region':
//             businessAreaModel = Businessarearegion;
//             break;
//           case 'zone':
//             businessAreaModel = Businessareazone;
//             break;
//           default:
//             businessAreaModel = null;
//         }

//         if (businessAreaModel) {
//           try {
//             const fetchedBusinessAreas = await businessAreaModel.where('id', 'IN', businessAreaArray).fetchAll({ require: false });
//             businessAreaData = fetchedBusinessAreas.toJSON().map(b => ({ id: b.id, name: b.name }));
//           } catch (error) {
//             console.error("Error fetching business area data:", error);
//           }
//         }
//       }

//       return {
//         ...user,
//         staff_photo: processAttachment(user.staff_photo),
//         assigned_data: assigned ? {
//           ...assigned,
//           warehouse_id: warehouseData,
//           business_area_id: businessAreaData
//         } : {},
//         // assigned_to_data: assignedTo || {},
//         pincode_id: pincode ? { id: pincode.id, pin_code: pincode.pin_code } : null,
//         place_id: place ? { id: place.id, place_name: place.place_name } : null,
//         menu_plan_id: menuPlan ? { id: menuPlan.id, menu_name: menuPlan.menu_name } : null
//       };
//     }));

//     console.log("Final response data:", usersData);
//     return res.success({ users: usersData });
//   } catch (error) {
//     console.error("Error occurred:", error);
//     return res.serverError(500, ErrorHandler(error));
//   }
// };
'use strict';
const { ErrorHandler, processAttachment } = require('../../../../../../lib/utils');
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
const { constants } = require('../../../../../../config');
const getUpwardUserHierarchy1 = require('../../../../../../middlewares/get.user.hierarchy.staff');

module.exports = async (req, res) => {
  try {
    const userHierarchy = await getUpwardUserHierarchy1(req.user.id);
    console.log('userHierarchy', userHierarchy);
    console.log("req.user.id", req.user.id);


    const userIdsArray = Array.from(userHierarchy);

    const allUsers = await User.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere('role', '=', 'user')
        .whereIn('added_by', userIdsArray)
        .orderBy('created_at', 'asc');
    }).fetchAll({ require: false, withRelated: ['staff_photo'] });

    const allUsersJson = allUsers.toJSON();
    const allUserIds = allUsersJson.map(user => user.id);

    // Fetch assigned where user_id matches these users
    const assignedDetails = await Assigned.query(qb => {
      qb.whereIn('user_id', allUserIds);
    }).fetchAll({ require: false });

    const assignedJson = assignedDetails.toJSON();
    const assignedUserIds = assignedJson.map(a => a.user_id);

    // Filter users that have an assigned record
    const usersJson = allUsersJson.filter(user => assignedUserIds.includes(user.id));

    // Gather warehouse, pincode, place, menu info
    const warehouseIds = new Set();
    assignedJson.forEach(a => {
      let wids = Array.isArray(a.warehouse_id) ? a.warehouse_id : (a.warehouse_id ? [a.warehouse_id] : []);
      wids.forEach(id => warehouseIds.add(id));
    });

    const warehouseDetails = await Warehouseinformation.where('id', 'IN', Array.from(warehouseIds)).fetchAll({ require: false });
    const pincodeDetails = await Pin.where('id', 'IN', usersJson.map(user => user.pincode_id)).fetchAll({ require: false });
    const placeDetails = await Place.where('id', 'IN', usersJson.map(user => user.place_id)).fetchAll({ require: false });
    const menuPlanDetails = await Menu.where('id', 'IN', usersJson.map(user => user.menu_plan_id)).fetchAll({ require: false });

    const usersData = await Promise.all(usersJson.map(async user => {
      const assigned = assignedJson.find(a => String(a.user_id) === String(user.id));
      const pincode = pincodeDetails.toJSON().find(p => p.id === user.pincode_id);
      const place = placeDetails.toJSON().find(p => p.id === user.place_id);
      const menuPlan = menuPlanDetails.toJSON().find(m => m.id === user.menu_plan_id);

      let warehouseData = {};
      if (assigned?.warehouse_id) {
        let widArray = Array.isArray(assigned.warehouse_id) ? assigned.warehouse_id : [assigned.warehouse_id];
        const warehouse = warehouseDetails.toJSON().find(w => w.id === widArray[0]);
        warehouseData = warehouse ? { id: warehouse.id, name: warehouse.name } : {};
      }

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

    console.log("Final response data:", usersData);
    return res.success({ users: usersData });

  } catch (error) {
    console.error("Error occurred:", error);
    return res.serverError(500, ErrorHandler(error));
  }
};
