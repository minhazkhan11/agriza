'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Deliverypoint = require('../../../../../models/deliverypoint');
const ShipInfo = require('../../../../../models/shiptopartyinfo');
const Attachment = require('../../../../../models/attachments');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let userBody = req.body.ship_to_party;

    if (!userBody || typeof userBody !== 'object') {
      return res.status(400).json({ success: false, message: "Invalid or missing 'ship_to_party' data." });
    }

    const shipId = userBody.id;
    const customer_id = userBody.customer_id;

    if (!shipId || !customer_id) {
      return res.status(400).json({ success: false, message: "'id' and 'customer_id' are required for update." });
    }

    // Fetch and update Deliverypoint
    const ship = await Deliverypoint.where({ id: shipId }).fetch({ require: false });
    if (!ship) {
      return res.status(404).json({ success: false, message: "Delivery point not found." });
    }

    await ship.save({
      business_name: userBody.business_name,
      gst_no: userBody.gst_no,
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
    }, { patch: true });

    let updatedShipInfoIds = [];

    if (Array.isArray(userBody.license_info)) {
      for (const info of userBody.license_info) {
        if (!info.id) {
          console.warn("Skipped license_info without ID.");
          continue;
        }

        const shipInfo = await ShipInfo.where({ id: info.id }).fetch({ require: false });

        if (!shipInfo) continue;

        await shipInfo.save({
          license_type: info.license_type,
          license_no: info.license_no,
          fms_no: info.fms_no,
          added_by: customer_id
        }, { patch: true });

        updatedShipInfoIds.push(info.id);

        // Add new image (optional)
        if (info.license_image) {
          // Deactivate old images for this license info
          await Attachment.query(qb => {
            qb.where('entity_id', shipInfo.id)
              .andWhere('entity_type', 'license_image')
              .andWhere('active_status', constants.activeStatus.active);
          }).save({ active_status: constants.activeStatus.inactive }, { patch: true });

          // Add new image
          await new Attachment({
            entity_id: shipInfo.id,
            entity_type: "license_image",
            photo_path: info.license_image,
            active_status: constants.activeStatus.active,
            added_by: req.user.id
          }).save();
        }

      }
    }

    // Fetch updated license_info with images
    const updatedInfos = await ShipInfo.where('id', 'IN', updatedShipInfoIds).fetchAll({
      require: false,
      withRelated: {
        license_image: (qb) => qb.where('active_status', constants.activeStatus.active)
      }
    });

    const infoData = updatedInfos.toJSON().map(info => ({
      ...info,
      license_image: Array.isArray(info.license_image)
        ? info.license_image.map(att => att.photo_path)
        : []
    }));

    return res.status(200).json({
      success: true,
      message: "Ship to Party and License Info updated successfully!",
      ship_to_party_Details: ship.toJSON(),
      shipinfo: infoData
    });

  } catch (error) {
    console.error("Error updating ship_to_party:", error);
    return res.status(500).json({ success: false, error: ErrorHandler(error) });
  }
};
