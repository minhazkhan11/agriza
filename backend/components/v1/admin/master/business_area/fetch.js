'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Businessarea = require('../../../../../models/business_area');
const Businessareateritary = require('../../../../../models/business_area_teritari');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        // **Fetch Business Area**
        const business_areas = await Businessarea.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .orderBy('created_at', 'asc');
        }).fetchAll({ require: false });

        if (!business_areas || business_areas.isEmpty()) {
            return res.success({ business_areaData: [], count: 0 });
        }

        let business_areaData = business_areas.toJSON();

        // **Extract Unique teritari_ids**
        let allTeritariIds = new Set();
        business_areaData.forEach(area => {
            if (area.teritari_ids) {
                if (typeof area.teritari_ids === 'string') {
                    area.teritari_ids = area.teritari_ids.split(',').map(id => parseInt(id.trim(), 10)).filter(Boolean);
                } else if (!Array.isArray(area.teritari_ids)) {
                    area.teritari_ids = [parseInt(area.teritari_ids, 10)].filter(Boolean);
                }
                area.teritari_ids.forEach(id => allTeritariIds.add(id));
            } else {
                area.teritari_ids = [];
            }
        });

        // **Fetch All Business Area Teritari**
        let teritariDataMap = {};
        if (allTeritariIds.size > 0) {
            const businessareateritaries = await Businessareateritary.query((qb) => {
                qb.whereIn('id', Array.from(allTeritariIds))
                    .orderBy('created_at', 'asc');
            }).fetchAll({ require: false, columns: ['id', 'name', 'short_name'] });

            let teritariData = businessareateritaries ? businessareateritaries.toJSON() : [];
            teritariData.forEach(teritari => {
                teritariDataMap[teritari.id] = teritari;
            });
        }

        // **Map teritariData to Each Business Area**
        business_areaData = business_areaData.map(area => {
            return {
                ...area,
                teritariData: area.teritari_ids.map(id => teritariDataMap[id] || {}).filter(data => Object.keys(data).length > 0)
            };
        });

        return res.success({
            business_areaData,
            count: business_areaData.length
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
