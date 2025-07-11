'use strict';
const LicenseCategory = require('../../../../../models/license_category')
const { ErrorHandler } = require('../../../../../lib/utils');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const license_category = await LicenseCategory.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ id: req.params.id })
        .orderBy('created_at', 'asc');
    }).fetch({ require: false, columns: ['id', 'license_category_name' , 'description'], });

    if (!license_category)
      return res.serverError(400, 'invalid license_category');
    return res.success({ license_category });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
