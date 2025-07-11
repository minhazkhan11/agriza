'use strict';
const LicenseProduct = require('../../../../../models/license_product')
const { ErrorHandler } = require('../../../../../lib/utils');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {

    const id = req.body.license_product.id;
    let Check = await LicenseProduct.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler('Data not found'));


    const body = req.body.license_product
    const data = await new LicenseProduct().where({ id }).save(body, { method: 'update' });

    const newProductCategory = await LicenseProduct.where({ id }).fetch({ require: false });

    return res.success({ license_product: newProductCategory });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};