'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Lead_subCategory = require('../../../../../models/lead_sub_category');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const lead_sub_category = await Lead_subCategory.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .orderBy('created_at', 'asc');
        }).fetchAll({ require: false,
            withRelated: [{
                'lead_category': function (query) {
                    query.select('id','name');
                }
            }]});

        const count = lead_sub_category.length;

        return res.success({
            lead_sub_category, count
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
