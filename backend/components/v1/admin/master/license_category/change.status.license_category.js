'use strict';
const LicenseCategory = require('../../../../../models/license_category')
const { ErrorHandler } = require('../../../../../lib/utils');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {

    const id = req.body.license_category.id;
    let Check = await LicenseCategory.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler(' License Category Name Not Found'));

    const body = req.body.license_category;
    const license_category = await new LicenseCategory().where({ id }).save(body, { method: 'update' });

    return res.success({ license_category });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};