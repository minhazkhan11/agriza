'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Category = require('../../../../../models/Vender_category');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.serverError(400, 'Missing Vender_category ID');
    }

    const vender_category = await Category.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ id: req.params.id })
        .orderBy('created_at', 'asc');
    }).fetch({ require: false });

    if (!vender_category) {
      return res.serverError(400, 'Invalid vender_category');
    }

    return res.success({ vender_category: vender_category });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};


