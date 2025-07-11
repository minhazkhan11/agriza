'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Lead_subCategory = require('../../../../../models/lead_sub_category');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        if (!req.params.id) {
            return res.serverError(400, 'Missing lead_sub_category ID');
        }

        // Fetch lead_sub_category by ID
        const lead_sub_category = await Lead_subCategory.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .andWhere({ id: req.params.id })
                .orderBy('created_at', 'asc');
        }).fetch({ require: false,
            withRelated: [{
                'lead_category': function (query) {
                    query.select('id','name');
                }
            }]
         });

        if (!lead_sub_category) {
            return res.serverError(400, 'Invalid lead_sub_category');
        }

        return res.success({ lead_sub_category: lead_sub_category });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};


