'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Category = require('../../../../../models/business_category');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        const category = await Category.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .andWhere({ id: req.params.id })
                .orderBy('created_at', 'asc');
        }).fetch({ require: false });

        if (!category)
            return res.serverError(400, 'invalid category');
        return res.success({ category });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
