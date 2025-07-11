'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Ship = require('../../../../../models/deliverypoint');
const ShipInfo = require('../../../../../models/shiptopartyinfo');
const Attachment = require('../../../../../models/attachments');
const { constants } = require('../../../../../config');
const { uploadToS3Bucket, getObjectUrl } = require('../../../../../lib/utils/aws/s3');
const generateObjectKey = require('../../../../../lib/utils/aws/s3/generateObjectKey');

module.exports = async (req, res) => {
  try {
    let userBody = req.body.delivery_point;

    if (!userBody) {
      return res.status(400).json({ success: false, error: "delivery_point_Details data is required in form-data." });
    }

    if (typeof userBody === "string") {
      try {
        userBody = JSON.parse(userBody);
      } catch (err) {
        return res.status(400).json({ success: false, error: "Invalid JSON format in delivery_point_Details data." });
      }
    }

    const id = userBody.id;
    if (!id) {
      return res.status(400).json({ success: false, error: "delivery_point_Details ID is required for update." });
    }

    let deliveryPointDetails = await Ship.where({ id }).fetch({ require: false });
    if (!deliveryPointDetails) {
      return res.status(404).json({ success: false, error: "delivery_point_Details not found." });
    }

    await deliveryPointDetails.save({
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
      email: userBody.email
    });

    let shipinfoRecords = [];

    if (Array.isArray(userBody.license_info)) {
      for (let info of userBody.license_info) {
        let shipinfo = await ShipInfo.where({ id: info.id || null, ship_id: deliveryPointDetails.id }).fetch({ require: false });

        if (shipinfo) {
          await shipinfo.save({
            license_type: info.license_type,
            license_no: info.license_no,
            fms_no: info.fms_no
          });
        } else {
          shipinfo = await new ShipInfo({
            ship_id: deliveryPointDetails.id,
            license_type: info.license_type,
            license_no: info.license_no,
            fms_no: info.fms_no,
            added_by: req.user.id
          }).save();
        }

        shipinfoRecords.push(shipinfo.id);

        if (req.files?.license_image && Array.isArray(req.files.license_image)) {
          for (const file of req.files.license_image) {
            if (file) {
              let existingAttachment = await Attachment.where({
                entity_id: shipinfo.id,
                entity_type: "license_image",
                active_status: constants.activeStatus.active
              }).fetch({ require: false });

              if (existingAttachment) {
                await existingAttachment.save({ active_status: constants.activeStatus.inactive });
              }

              let fileUrl = existingAttachment ? existingAttachment.get('photo_path') : null;

              if (fileUrl) {
                await new Attachment({
                  entity_id: shipinfo.id,
                  entity_type: "license_image",
                  photo_path: fileUrl,
                  active_status: constants.activeStatus.active,
                }).save();
              }
            }
          }
        }
      }
    }

    const updatedLicenseInfo = await ShipInfo.where('id', 'IN', shipinfoRecords).fetchAll({
      require: false,
      withRelated: {
        license_image: (qb) => qb.where('active_status', constants.activeStatus.active)
      },
    });

    const infoData = updatedLicenseInfo.toJSON().map(info => ({
      ...info,
      license_image: Array.isArray(info.license_image) ? info.license_image.map(att => att.photo_path) : []
    }));

    return res.json({
      success: true,
      delivery_point_Details: deliveryPointDetails.toJSON(),
      shipinfo: infoData
    });
  } catch (error) {
    console.error("Error updating delivery point details:", error);
    return res.status(500).json({ success: false, error: ErrorHandler(error) });
  }
};