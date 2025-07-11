'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Category = require('../../../../../models/customer_category');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.serverError(400, 'Missing customer_category ID');
    }

    const customer_category = await Category.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ id: req.params.id })
        .orderBy('created_at', 'asc');
    }).fetch({ require: false });

    if (!customer_category) {
      return res.serverError(400, 'Invalid customer_category');
    }

    return res.success({ customer_category: customer_category });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};


