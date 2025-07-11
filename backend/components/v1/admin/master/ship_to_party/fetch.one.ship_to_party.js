'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Deliverypoint = require('../../../../../models/deliverypoint');
const ShipInfo = require('../../../../../models/shiptopartyinfo');
const Attachment = require('../../../../../models/attachments');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    const shipId = req.params?.id;

    if (!shipId) {
      return res.status(400).json({ success: false, message: "Missing 'id' in request params" });
    }

    // 1. Fetch Deliverypoint by ID
    const ship = await Deliverypoint.where({ id: shipId }).fetch({
      require: false,
      withRelated: {
        pincode_id: (qb) => qb.select('id', 'pin_code'),
        place_id: (qb) => qb.select('id', 'place_name'),
        gst_id: (qb) => qb.select('id', 'gst_number'),
      }
    });

    if (!ship) {
      return res.status(404).json({ success: false, message: "Ship to Party not found" });
    }

    const shipData = ship.toJSON();

    // 2. Fetch related ShipInfo
    const shipInfos = await ShipInfo.query(qb => {
      qb.where('ship_id', shipId)
        .whereIn('active_status', [
          constants.activeStatus.active,
          constants.activeStatus.inactive
        ]);
    }).fetchAll({ require: false });

    const shipInfoData = shipInfos.toJSON();
    const shipInfoIds = shipInfoData.map(info => info.id);

    // 3. Fetch attachments for each shipinfo
    const attachments = await Attachment.query(qb => {
      qb.whereIn('entity_id', shipInfoIds)
        .andWhere('entity_type', 'license_image')
        .andWhere('active_status', 'active');
    }).fetchAll({ require: false });

    const imageMap = {};
    attachments.toJSON().forEach(att => {
      if (!imageMap[att.entity_id]) {
        imageMap[att.entity_id] = att.photo_path;
      }
    });

    // 4. Append license image to each shipinfo
    const enrichedShipInfo = shipInfoData.map(info => ({
      ...info,
      license_image: imageMap[info.id] || ''
    }));

    // 5. Add shipinfo inside ship_to_party_Details
    const finalShipData = {
      ...shipData,
      license_info: enrichedShipInfo
    };

    return res.status(200).json({
      success: true,
      message: "Ship to Party fetched successfully",
      ship_to_party: finalShipData
    });

  } catch (error) {
    console.error("Error fetching ship_to_party:", error);
    return res.status(500).json({ success: false, error: ErrorHandler(error) });
  }
};
