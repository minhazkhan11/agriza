'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Deliverypoint = require('../../../../../models/deliverypoint');
const ShipInfo = require('../../../../../models/shiptopartyinfo');
const Attachment = require('../../../../../models/attachments');
const BeIdentityTable = require('../../../../../models/be_identity_table');
const BeInformation = require('../../../../../models/be_information');
const GstPerson = require('../../../../../models/be_gst_person_assigned');
const Gst = require('../../../../../models/be_gst_details');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    if (!req.body || typeof req.body !== "object" || !req.body.ship_to_party) {
      return res.status(400).json({ success: false, message: "Missing 'ship_to_party' in request body." });
    }

    let userBody = req.body.ship_to_party;

    if (typeof userBody === "string") {
      try {
        userBody = JSON.parse(userBody);
      } catch (error) {
        console.error("Invalid JSON in 'ship_to_party':", error);
        return res.status(400).json({ success: false, message: "Invalid JSON format in request." });
      }
    }

    if (!userBody || typeof userBody !== "object") {
      return res.status(400).json({ success: false, message: "Invalid 'ship_to_party' data." });
    }

    if (!userBody.customer_id) {
      return res.status(400).json({ success: false, message: "'customer_id' is required in 'ship_to_party'." });
    }

    const customer_id = userBody.customer_id;

    // Check if the record already exists with the same place_id, pincode_id, and added_by
    const existingRecord = await Deliverypoint.where({
      place_id: userBody.place_id,
      pincode_id: userBody.pincode_id,
      added_by: customer_id
    }).fetch({ require: false });

    if (existingRecord) {
      return res.status(409).json({ success: false, message: "Ship to Party with the same details already exists." });
    }

    // Create a new Deliverypoint record
    const ship = await new Deliverypoint({
      business_name: userBody.business_name,
      // gst_no: userBody.gst_no,
      gst_id: userBody.gst_id,
      warehouse_name: userBody.warehouse_name,
      warehouse_address: userBody.warehouse_address,
      pincode_id: userBody.pincode_id,
      place_id: userBody.place_id,
      latitude: userBody.latitude,
      longitude: userBody.longitude,
      scm_person_name: userBody.scm_person_name,
      mobile_no: userBody.mobile_no,
      email: userBody.email,
      added_by: customer_id
    }).save();

    let shipinfoRecords = [];

    if (Array.isArray(userBody.license_info) && userBody.license_info.length > 0) {
      for (let info of userBody.license_info) {
        const shipinfo = await new ShipInfo({
          ship_id: ship.id,
          license_type: info.license_type,
          license_no: info.license_no,
          fms_no: info.fms_no,
          added_by: customer_id
        }).save();

        shipinfoRecords.push(shipinfo.id);

        if (info.license_image) {
          await new Attachment({
            entity_id: shipinfo.id,
            entity_type: "license_image",
            photo_path: info.license_image,
            active_status: constants.activeStatus.active,
            added_by: req.user.id,
          }).save();
        }
      }
    }

    const newInfo = await ShipInfo.where('id', 'IN', shipinfoRecords).fetchAll({
      require: false,
      withRelated: {
        license_image: (qb) => qb.where('active_status', constants.activeStatus.active)
      },
    });

    const infoData = newInfo.toJSON().map(info => ({
      ...info,
      license_image: Array.isArray(info.license_image)
        ? info.license_image.map(att => att.photo_path)
        : []
    }));

    return res.status(200).json({
      success: true,
      message: "Ship to Party successfully added!",
      ship_to_party_Details: ship.toJSON(),
      shipinfo: infoData
    });

  } catch (error) {
    console.error("Error adding ship_to_party:", error);
    return res.status(500).json({ success: false, error: ErrorHandler(error) });
  }
};
