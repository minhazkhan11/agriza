'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Category = require('../../../../../models/customer_category');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const customer_category = await Category.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .orderBy('created_at', 'asc');
        }).fetchAll({ require: false });

       
        const count = customer_category.length;

        return res.success({
          customer_category, count
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};