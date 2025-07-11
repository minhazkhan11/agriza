'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Product = require('../../../../../models/product');
const { constants } = require('../../../../../config');
const Attachments = require('../../../../../models/attachments');


module.exports = async (req, res, next) => {
  try {

    const id = req.body.product.id;
    let Check = await Product.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler('Product not found'));

    const body = req.body.product;
    const product = await new Product().where({ id }).save(body, { method: 'update' });

    const newproduct = await Product.where({ id }).fetch({ require: false });

    return res.success({ product: newproduct });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};