'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Businessareazone = require('../../../../../models/business_area_zone');
const Businessarearegion = require('../../../../../models/business_area_region');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        // **Fetch Single Business Area Zone**
        const business_area_zone = await Businessareazone.where({ id: req.params.id })
            .query((qb) => {
                qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive]);
            })
            .fetch({ require: false });

        if (!business_area_zone) {
            return res.serverError(400, 'Invalid business_area_zone');
        }

        let businessAreaZoneData = business_area_zone.toJSON();

        // **Extract & Parse region_ids**
        let regionIds = businessAreaZoneData.region_ids;

        if (!regionIds) {
            businessAreaZoneData.regionData = [];
        } else {
            if (typeof regionIds === 'string') {
                regionIds = regionIds.split(',').map(id => parseInt(id.trim(), 10)).filter(Boolean);
            } else if (!Array.isArray(regionIds)) {
                regionIds = [parseInt(regionIds, 10)].filter(Boolean);
            }

            // **Fetch Region Data**
            const regionData = await Businessarearegion.query((qb) => {
                qb.whereIn('id', regionIds).orderBy('created_at', 'asc');
            }).fetchAll({ require: false, columns: ['id', 'name'] });

            businessAreaZoneData.regionData = regionData ? regionData.toJSON() : [];
        }

        return res.success({
            business_area_zone: businessAreaZoneData
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
