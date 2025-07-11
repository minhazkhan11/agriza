'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Versionings = require('../../../../../models/o_form_versioning');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.o_form_versioning;


    body.license_product_id = Array.isArray(body.license_product_id) && body.license_product_id.length > 0
      ? JSON.stringify(body.license_product_id)
      : null;


    // Check if any versioning exists regardless of name/license_id
    const check = await Versionings.query((qb) => {
      qb.whereIn('active_status', ['active', 'inactive']);
    }).fetch({ require: false });


    body.added_by = req.user.id;

    const o_form_versioning = await new Versionings(body).save();

    return res.success({ o_form_versioning });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
