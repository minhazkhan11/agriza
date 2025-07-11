
'use strict';
const ProductCategory = require('../../../../../models/product_category')
const { ErrorHandler } = require('../../../../../lib/utils');


module.exports = async (req, res, next) => {
  try {

    const id = req.body.productCategory.id;
    let Check = await ProductCategory.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler(' Product Category name not found'));

    const body = req.body.productCategory;
    const productCategory = await new ProductCategory().where({ id }).save(body, { method: 'update' });

    return res.success({ productCategory });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};