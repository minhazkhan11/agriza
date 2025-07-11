'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const ProductCategory = require('../../../../../models/product_category')
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const productCategory = await ProductCategory.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ product_class_id: req.params.id })
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      columns: ['id', 'category_name']
    });

    if (!productCategory)
      return res.serverError(400, 'invalid category_name ');
    return res.success({ productCategory: productCategory });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
