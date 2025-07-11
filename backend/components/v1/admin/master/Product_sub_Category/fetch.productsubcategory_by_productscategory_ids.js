'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const ProductSubCategory = require('../../../../../models/product_sub_category')
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    let Category_id = req.body.ids || [];

    if (!Array.isArray(Category_id) || Category_id.length === 0) {
      return res.serverError(400, 'Invalid or missing Category IDs');
    }

    const product_sub_category = await ProductSubCategory.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .whereIn('Product_category_id', Category_id)
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      columns: ['id', 'product_sub_category_name', 'Product_category_id']
    });

    if (!product_sub_category || product_sub_category.length === 0) {
      return res.serverError(400, 'No product_sub_category found for given Product_category_id');
    }

    return res.success({ product_sub_category });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
