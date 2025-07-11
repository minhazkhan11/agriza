'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Businessarearegion = require('../../../../../models/business_area_region');
const { constants } = require('../../../../../config');
const Businessarea = require('../../../../../models/business_area');

module.exports = async (req, res, next) => {
    try {
        const business_area_regions = await Businessarearegion.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .orderBy('created_at', 'asc');
        }).fetchAll({ require: false });

        if (!business_area_regions || business_area_regions.isEmpty()) {
            return res.success({ regionArray: [], count: 0 });
        }

        let regionArray = [];
        let allAreaIds = new Set();

        // **Extract Unique area_ids**
        for (const region of business_area_regions) {
            let regionJson = region.toJSON();

            if (regionJson.area_ids) {
                if (typeof regionJson.area_ids === 'string') {
                    regionJson.area_ids = regionJson.area_ids.split(',').map(id => parseInt(id.trim(), 10)).filter(Boolean);
                } else if (!Array.isArray(regionJson.area_ids)) {
                    regionJson.area_ids = [parseInt(regionJson.area_ids, 10)].filter(Boolean);
                }
                regionJson.area_ids.forEach(id => allAreaIds.add(id));
            } else {
                regionJson.area_ids = [];
            }

            regionArray.push(regionJson);
        }

        // **Fetch All Business Areas**
        let areaDataMap = {};
        if (allAreaIds.size > 0) {
            const businessAreas = await Businessarea.query((qb) => {
                qb.whereIn('id', Array.from(allAreaIds))
                    .orderBy('created_at', 'asc');
            }).fetchAll({ require: false, columns: ['id', 'name'] });

            let areaData = businessAreas ? businessAreas.toJSON() : [];
            areaData.forEach(area => {
                areaDataMap[area.id] = area;
            });
        }

        // **Map areaData to Each Business Area Region**
        regionArray = regionArray.map(region => {
            return {
                ...region,
                areaData: region.area_ids.map(id => areaDataMap[id] || {}).filter(data => Object.keys(data).length > 0)
            };
        });

        return res.success({
            regionArray,
            count: regionArray.length
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
