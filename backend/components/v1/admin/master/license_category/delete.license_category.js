'use strict';
const LicenseCategory = require('../../../../../models/license_category')
const { ErrorHandler } = require('../../../../../lib/utils');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    //Get logged in user
    let check = await LicenseCategory.where({ id: req.params.id }).fetch({ require: false });
    if (!check)
      return res.serverError(400, ErrorHandler(new Error(' License Category Name Not Found')));
    await new LicenseCategory().where({ id: req.params.id }).save({ active_status: constants.activeStatus.deleted }, { method: 'update' })
      .then(() => {
        return res.success({ 'message': ' License Categoryname Deleted ssccessfully' });
      })
      .catch(err => {
        return res.serverError(400, ErrorHandler('Something went wrong'));
      })
  } catch (error) {
    console.log('errorrr', error);
    return res.serverError(500, ErrorHandler(error));
  }
};