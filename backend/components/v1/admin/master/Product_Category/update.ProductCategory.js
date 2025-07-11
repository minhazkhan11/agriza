


'use strict';
const ProductCategory = require('../../../../../models/product_category')
const { ErrorHandler } = require('../../../../../lib/utils');
const { constants } = require('../../../../../config');
module.exports = async (req, res, next) => {
  try {

    const id = req.body.productCategory.id;
    let Check = await ProductCategory.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler('Data not found'));


    const body = req.body.productCategory
    const data = await new ProductCategory().where({ id }).save(body, { method: 'update' });

    const newProductCategory = await ProductCategory.where({ id }).fetch({ require: false });

    return res.success({ productCategory: newProductCategory });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};