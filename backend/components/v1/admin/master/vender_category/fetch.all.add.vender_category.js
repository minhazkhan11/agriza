'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Category = require('../../../../../models/Vender_category');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const vender_category = await Category.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .orderBy('created_at', 'asc');
        }).fetchAll({ require: false });


        const count = vender_category.length;

        return res.success({
            vender_category, count
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};