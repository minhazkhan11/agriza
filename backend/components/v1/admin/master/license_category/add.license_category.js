'use strict';
const LicenseCategory = require('../../../../../models/license_category')
const { ErrorHandler } = require('../../../../../lib/utils');
const { constants } = require('../../../../../config');


module.exports = async (req, res) => {
  try {
    let body = req.body.license_category;

    const check = await LicenseCategory
      .query((qb) => {
        qb.where(function () {
          this.where('license_category_name', body.license_category_name)
        })
          .whereIn('active_status', ['active', 'inactive']);
      })
      .fetch({ require: false });

    if (check) {
      return res.serverError(500, ErrorHandler(" license_category already exists "));
    }

    body.added_by = req.user.id;

    const license_category = await new LicenseCategory(body).save();

    return res.success({ license_category });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};