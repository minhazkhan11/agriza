'use strict';
const ProductCategory = require('../../../../../models/product_category')
const { ErrorHandler } = require('../../../../../lib/utils');


module.exports = async (req, res) => {
  try {
    let body = req.body.productCategory;

    const check = await ProductCategory
      .query((qb) => {
        qb.where(function () {
          this.where('category_name', body.category_name)
        })
          .whereIn('active_status', ['active', 'inactive']);
      })
      .fetch({ require: false });

    if (check) {
      return res.serverError(500, ErrorHandler(" category_name already exists "));
    }

    body.added_by = req.user.id;

    const productCategory = await new ProductCategory(body).save();

    return res.success({ productCategory });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};