
'use strict';
const ProductSubCategory = require('../../../../../models/product_sub_category')
const { ErrorHandler } = require('../../../../../lib/utils');


module.exports = async (req, res, next) => {
  try {

    const id = req.body.product_sub_category.id;
    let Check = await ProductSubCategory.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler(' Product sub Category name not found'));

    const body = req.body.product_sub_category;
    const product_sub_category = await new ProductSubCategory().where({ id }).save(body, { method: 'update' });

    return res.success({ product_sub_category });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};