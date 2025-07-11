'use strict';
const ProductCategory = require('../../../../../models/product_category')
const { ErrorHandler } = require('../../../../../lib/utils');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const productCategory = await ProductCategory.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ id: req.params.id })
        .orderBy('created_at', 'asc');
    }).fetch({ require: false });

    if (!productCategory)
      return res.serverError(400, 'invalid productCategory');
    return res.success({ productCategory });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
