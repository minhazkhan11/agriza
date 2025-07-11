'use strict';
const LicenseProduct = require('../../../../../models/license_product')
const { ErrorHandler } = require('../../../../../lib/utils');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const license_product = await LicenseProduct.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ be_license_id: req.params.id })
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false, withRelated: [
        {
          'be_license_id': function (query) {
            query.select('id', 'license_name');
          }
        }], columns: ['id', 'name_of_product', 'brand_name', 'source_of_supply', 'be_license_id', "active_status"],
    });

    if (!license_product)
      return res.serverError(400, 'invalid license_product');
    return res.success({ license_product });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
