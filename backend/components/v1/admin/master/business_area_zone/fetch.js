'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Businessareazone = require('../../../../../models/business_area_zone');
const Businessarearegion = require('../../../../../models/business_area_region');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        // **Fetch Business Area Zone**
        const business_area_zone = await Businessareazone.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .orderBy('created_at', 'asc');
        }).fetchAll({ require: false });

        if (!business_area_zone || business_area_zone.isEmpty()) {
            return res.success({ business_area_zone: [], count: 0 });
        }

        let businessAreaZoneData = business_area_zone.toJSON();

        // **Process Each Zone & Fetch Associated Regions**
        for (let zone of businessAreaZoneData) {
            let regionIds = zone.region_ids;

            if (!regionIds) {
                zone.regionData = [];
                continue;
            }

            if (typeof regionIds === 'string') {
                regionIds = regionIds.split(',').map(id => parseInt(id.trim(), 10)).filter(Boolean);
            } else if (!Array.isArray(regionIds)) {
                regionIds = [parseInt(regionIds, 10)].filter(Boolean);
            }

            // **Fetch Region Data**
            const regionData = await Businessarearegion.query((qb) => {
                qb.whereIn('id', regionIds).orderBy('created_at', 'asc');
            }).fetchAll({ require: false, columns: ['id', 'name'] });

            zone.regionData = regionData ? regionData.toJSON() : [];
        }

        return res.success({
            business_area_zone: businessAreaZoneData,
            count: businessAreaZoneData.length
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
