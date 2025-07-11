'use strict';
const ProductClass = require('../../../../../models/product_class')
const { ErrorHandler } = require('../../../../../lib/utils');

module.exports = async (req, res, next) => {
  try {

    const id = req.body.productClass.id;
    let Check = await ProductClass.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler('Unit not found'));

    const body = req.body.productClass;
    const productClass = await new ProductClass().where({ id }).save(body, { method: 'update' });

    return res.success({ productClass });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};