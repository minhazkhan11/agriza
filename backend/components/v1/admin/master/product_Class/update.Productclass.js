'use strict';
const ProductClass = require('../../../../../models/product_class')
const { ErrorHandler } = require('../../../../../lib/utils');
const { constants } = require('../../../../../config');
module.exports = async (req, res, next) => {
  try {

    const id = req.body.productClass.id;
    let Check = await ProductClass.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler('Data not found'));


    const body = req.body.productClass
    const data = await new ProductClass().where({ id }).save(body, { method: 'update' });

    const newproductClass = await ProductClass.where({ id }).fetch({ require: false });

    return res.success({ productClass: newproductClass });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};