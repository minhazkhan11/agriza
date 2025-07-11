'use strict';
const LicenseCategory = require('../../../../../models/license_category')
const { ErrorHandler } = require('../../../../../lib/utils');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const license_category = await LicenseCategory.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      columns: ['id', 'license_category_name' , "active_status"],
    });

    const count = license_category.length;

    return res.success({
      license_category, count
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};