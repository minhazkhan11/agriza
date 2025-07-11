
'use strict';
const ProductCategory = require('../../../../../models/product_category')
const { ErrorHandler } = require('../../../../../lib/utils');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const productCategory = await ProductCategory.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
    });

    const count = productCategory.length;

    return res.success({
      productCategory, count
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};