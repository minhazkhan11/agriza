'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Master_product = require('../../../../../models/master_product');
const { constants } = require('../../../../../config');


module.exports = async (req, res, next) => {
  try {

    const id = req.body.master_product.id;
    let Check = await Master_product.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler('master_product not found'));

    const body = req.body.master_product;
    const master_product = await new Master_product().where({ id }).save(body, { method: 'update' });

    const newmaster_product = await Master_product.where({ id }).fetch({ require: false });

    return res.success({ master_product: newmaster_product });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};