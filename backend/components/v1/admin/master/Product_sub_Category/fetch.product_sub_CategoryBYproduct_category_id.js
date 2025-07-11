'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const ProductSubCategory = require('../../../../../models/product_sub_category')
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const product_sub_category = await ProductSubCategory.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ Product_category_id: req.params.id })
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      columns: ['id', 'product_sub_category_name']
    });

    if (!product_sub_category)
      return res.serverError(400, 'invalid product_sub_category ');
    return res.success({ product_sub_category: product_sub_category });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
