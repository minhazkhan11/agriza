'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Businessarearegion = require('../../../../../models/business_area_region');
const Businessarea = require('../../../../../models/business_area');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        const business_area_region = await Businessarearegion.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .andWhere({ id: req.params.id });
        }).fetch({
            require: false
        });

        // **Handle case when no record is found**
        if (!business_area_region) {
            return res.serverError(400, 'Invalid business_area_region');
        }

        let businessAreaRegionData = business_area_region.toJSON();

        // **Extract & Parse area_ids**
        let areaIds = businessAreaRegionData.area_ids;

        if (!areaIds) {
            return res.success({
                business_area_region: { ...businessAreaRegionData, areaData: [] },
                count: 1
            });
        }

        if (typeof areaIds === 'string') {
            areaIds = areaIds.split(',').map(id => parseInt(id.trim(), 10)).filter(Boolean);
        } else if (!Array.isArray(areaIds)) {
            areaIds = [parseInt(areaIds, 10)].filter(Boolean);
        }

        // **Fetch Area Data**
        const areaData = await Businessarea.query((qb) => {
            qb.whereIn('id', areaIds).orderBy('created_at', 'asc');
        }).fetchAll({ require: false, columns: ['id', 'name'] });

        return res.success({
            business_area_region: { 
                ...businessAreaRegionData, 
                areaData: areaData ? areaData.toJSON() : [] 
            },
            count: 1
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
