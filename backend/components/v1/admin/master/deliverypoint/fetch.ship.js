'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Ship = require('../../../../../models/deliverypoint');
const ShipInfo = require('../../../../../models/shiptopartyinfo');
const Attachment = require('../../../../../models/attachments');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        // **Fetch all Ships**
        const ships = await Ship.query(qb => {
            qb.whereIn('active_status', [
                constants.activeStatus.active,
                constants.activeStatus.inactive
            ])
                .andWhere({ added_by: req.user.id }) // optional: filter by user
                .orderBy('created_at', 'asc');
        }).fetchAll({
            require: false,
            withRelated: [
                {
                    'pincode_id': function (query) {
                        query.select('id', 'pin_code');
                    },
                    'place_id': function (query) {
                        query.select('id', 'place_name');
                    }
                }
            ]
        });

        if (!ships) {
            return res.success({ delivery_point_Details: [], success: true });
        }

        const shipsData = ships.toJSON();
        const result = [];

        for (const ship of shipsData) {
            // **Fetch ShipInfo for this ship**
            const info = await ShipInfo.query(qb => {
                qb.whereIn('active_status', [
                    constants.activeStatus.active,
                    constants.activeStatus.inactive
                ])
                    .andWhere({ ship_id: ship.id })
                    .orderBy('created_at', 'asc');
            }).fetchAll({ require: false });

            const shipInfos = info.toJSON();
            const shipInfoIds = shipInfos.map(info => info.id);

            // **Fetch license image attachments**
            const licenseImages = await Attachment.query(qb => {
                qb.whereIn('entity_id', shipInfoIds)
                    .andWhere('entity_type', 'license_image')
                    .andWhere('active_status', 'active');
            }).fetchAll({ require: false });

            const imageMap = {};
            licenseImages.toJSON().forEach(att => {
                if (!imageMap[att.entity_id]) {
                    imageMap[att.entity_id] = att.photo_path; // take only first
                }
            });

            const shipInfoData = shipInfos.map(info => ({
                ...info,
                license_image: imageMap[info.id] || ''
            }));

            result.push({
                ...ship,
                ship_info: shipInfoData
            });
        }

        return res.success({
            success: true,
            delivery_point_Details: result
        });

    } catch (error) {
        console.error(error);
        return res.serverError(500, { error: ErrorHandler(error) });
    }
};
