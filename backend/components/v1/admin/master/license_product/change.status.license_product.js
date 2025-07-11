'use strict';
const LicenseProduct = require('../../../../../models/license_product')
const { ErrorHandler } = require('../../../../../lib/utils');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {

    const id = req.body.license_product.id;
    let Check = await LicenseProduct.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler(' License Category Name Not Found'));

    const body = req.body.license_product;
    const license_product = await new LicenseProduct().where({ id }).save(body, { method: 'update' });

    return res.success({ license_product });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};