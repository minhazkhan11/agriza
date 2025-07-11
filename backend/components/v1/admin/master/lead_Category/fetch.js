'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Lead_Category = require('../../../../../models/lead_category');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const lead_category = await Lead_Category.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .orderBy('created_at', 'asc');
        }).fetchAll({ require: false });

       
        const count = lead_category.length;

        return res.success({
            lead_category, count
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
