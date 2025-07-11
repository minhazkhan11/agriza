'use strict';


const { ErrorHandler } = require('../../../../../lib/utils');
const Licensedetails = require('../../../../../models/license_details');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {

    const id = req.body.license_details.id;
    let Check = await Licensedetails.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler(' License details not found'));

    const body = req.body.license_details;
    const license_details = await new Licensedetails().where({ id }).save(body, { method: 'update' });

    return res.success({ license_details });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};