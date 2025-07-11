'use strict';
const { ErrorHandler, processAttachment } = require('../../../../../../lib/utils');
const User = require('../../../../../../models/users');
const Assigned = require('../../../../../../models/assigned');
const Assigneds = require('../../../../../../models/assigned_to');
const Pin = require('../../../../../../models/pin');
const Place = require('../../../../../../models/place');
const Menu = require('../../../../../../models/menu_plan');
const Warehouseinformation = require('../../../../../../models/be_warehouse_information');
const Businessareateritary = require('../../../../../../models/business_area_teritari');
const Businessarea = require('../../../../../../models/business_area');
const Businessarearegion = require('../../../../../../models/business_area_region');
const Businessareazone = require('../../../../../../models/business_area_zone');
const Entitybasic = require('../../../../../../models/be_information');
const { constants } = require('../../../../../../config');
const Attachments = require('../../../../../../models/attachments');
const Gst = require('../../../../../../models/be_gst_details');



module.exports = async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id) {
      return res.serverError(400, ErrorHandler('User ID is required'));
    }

    // Fetch user details
    const user = await User.where({ id: user_id }).fetch({
      require: false,
    });

    if (!user) {
      return res.serverError(404, ErrorHandler('User not found'));
    }

    // **Fetch Staff, Aadhar, and PAN Photos**
    const fetchPhoto = async (type) => {
      let photo = await Attachments.where({
        entity_id: user_id,
        entity_type: type,
        active_status: constants.activeStatus.active
      }).orderBy('created_at', 'asc').fetch({ require: false });

      return photo ? processAttachment(photo.toJSON()) : null;
    };

    const processedStaffPhoto = await fetchPhoto('staff_photo');
    const processedAadharPhoto = await fetchPhoto('aadhaar');
    const processedPanPhoto = await fetchPhoto('pan');
    // Fetch assigned details
    const assignedDetails = await Assigned.where({ user_id: user_id }).fetchAll({ require: false });
    const assignedToDetails = await Assigneds.where({ user_id }).fetchAll({ require: false });

    let assigned = assignedDetails ? assignedDetails.toJSON()[0] : null;

    // Fetch pincode details
    let pincode = null;
    if (user.toJSON().pincode_id) {
      pincode = await Pin.where({ id: user.toJSON().pincode_id }).fetch({ require: false });
      pincode = pincode ? pincode.toJSON() : null;
    }
    // Fetch place details
    let place = null;
    if (user.toJSON().place_id) {
      place = await Place.where({ id: user.toJSON().place_id }).fetch({ require: false });
      place = place ? place.toJSON() : null;
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


    let gstData = [];
    if (assigned && assigned.gst_id) {
      let gstArray = Array.isArray(assigned.gst_id) ? assigned.gst_id : [assigned.gst_id];
      const gstDetails = await Gst.where('id', 'IN', gstArray).fetchAll({ require: false });

      gstData = gstDetails ? gstDetails.toJSON().map(w => ({ id: w.id, gst_number: w.gst_number, legal_name: w.legal_name, trade_name: w.trade_name, })) : [];
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
    userData.staff_photo = processedStaffPhoto;
    userData.aadhar_upload = processedAadharPhoto;
    userData.pan_upload = processedPanPhoto;
    userData.pincode_id = pincode ? { id: pincode.id, pin_code: pincode.pin_code } : null;
    userData.menu_plan_id = menuPlan ? { id: menuPlan.id, menu_name: menuPlan.menu_name } : null;
    userData.place_id = place ? { id: place.id, place_name: place.place_name } : null;

    userData.assigned_data = assigned
      ? {
        ...assigned,
        gst_id: gstData.length > 0 ? gstData : [],
        warehouse_id: warehouseData.length > 0 ? warehouseData : [],
        business_area_id: businessAreaData.length > 0 ? businessAreaData : []
      }
      : {};

    userData.assigned_to_data = assignedToData.length === 1 ? assignedToData[0] : assignedToData;

    console.log("Final User Data:", JSON.stringify(userData, null, 2));
    return res.success({ user: userData });

  } catch (error) {
    console.error("Error:", error);
    return res.serverError(500, ErrorHandler(error));
  }
};
