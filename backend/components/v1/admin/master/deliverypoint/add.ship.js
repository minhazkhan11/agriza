'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Deliverypoint = require('../../../../../models/deliverypoint');
const ShipInfo = require('../../../../../models/shiptopartyinfo');
const Attachment = require('../../../../../models/attachments');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let userBody = req.body.delivery_point;

    if (typeof userBody === "string") {
      userBody = JSON.parse(userBody);
    }

    // **Check if a delivery point with the same GST No already exists**
    const existingDeliveryPoint = await Deliverypoint.where({ gst_no: userBody.gst_no }).fetch({ require: false });

    if (existingDeliveryPoint) {
      return res.status(409).json({ success: false, message: "A delivery point with this GST No already exists." });
    }

    // **Create a new Ship record**
    const ship = await new Deliverypoint({
      business_name: userBody.business_name,
      gst_no: userBody.gst_no,
      warehouse_name: userBody.warehouse_name,
      warehouse_address: userBody.warehouse_address,
      pincode_id: userBody.pincode_id,
      place_id: userBody.place_id,
      latitude: userBody.latitude,
      longitude: userBody.longitude,
      scm_person_name: userBody.scm_person_name,
      mobile_no: userBody.mobile_no,
      email: userBody.email,
      added_by: req.user.id
    }).save();

    let shipinfoRecords = [];

    // **Ensure license_info is an array**
    if (Array.isArray(userBody.license_info) && userBody.license_info.length > 0) {
      for (let info of userBody.license_info) {
        let shipinfo = await new ShipInfo({
          ship_id: ship.id,
          license_type: info.license_type,
          license_no: info.license_no,
          fms_no: info.fms_no,
          added_by: req.user.id, // Directly storing the path
        }).save();

        shipinfoRecords.push(shipinfo.id);
        if (info.license_image) {
          await new Attachment({
            entity_id: shipinfo.id,
            entity_type: "license_image", // custom type
            photo_path: info.license_image,
            added_by: req.user.id,
            active_status: "active",
          }).save();
        }
      }
    }

    // **Fetch Updated License Details**
    const newInfo = await ShipInfo.where('id', 'IN', shipinfoRecords).fetchAll({
      require: false
    });

    const licenseImages = await Attachment.query((qb) => {
      qb.whereIn('entity_id', shipinfoRecords)
        .andWhere('entity_type', 'license_image')
        .andWhere('active_status', 'active');
    }).fetchAll({ require: false });

    const imageMap = {};
    licenseImages.toJSON().forEach(att => {
      imageMap[att.entity_id] = att.photo_path;
    });

    // Merge license image paths into shipinfo records
    const infoData = newInfo.toJSON().map(info => ({
      ...info,
      license_image: imageMap[info.id] || null
    }));

    // **Return success response**
    return res.success({
      success: true,
      delivery_point_Details: ship.toJSON(),
      shipinfo: infoData
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: ErrorHandler(error) });
  }
};
