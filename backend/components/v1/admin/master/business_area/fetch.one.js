'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Businessarea = require('../../../../../models/business_area');
const { constants } = require('../../../../../config');
const Businessareateritary = require('../../../../../models/business_area_teritari');

module.exports = async (req, res, next) => {
    try {
        // **Fetch Business Area**
        const business_area = await Businessarea.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .andWhere({ id: req.params.id })
                .orderBy('created_at', 'asc');
        }).fetch({ require: false });

        if (!business_area) {
            return res.serverError(400, 'Invalid business_area');
        }

        let business_areaData = business_area.toJSON();

        // **Extract teritari_ids & Handle Array/String Case**
        let teritariIds = business_areaData.teritari_ids;

        if (!teritariIds) {
            return res.success({ business_areaData, teritariData: [], count: 0 });
        }

        if (typeof teritariIds === 'string') {
            teritariIds = teritariIds.split(',').map(id => parseInt(id.trim(), 10));
        } else if (!Array.isArray(teritariIds)) {
            teritariIds = [parseInt(teritariIds, 10)];
        }

        // **Fetch Business Area Teritari**
        const businessareateritary = await Businessareateritary.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .whereIn('id', teritariIds)
                .orderBy('created_at', 'asc');
        }).fetchAll({ require: false,
            columns:['id','name','short_name']
         });

        const teritariData = businessareateritary ? businessareateritary.toJSON() : [];

        return res.success({
            business_areaData,
            teritariData,
            count: teritariData.length
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
