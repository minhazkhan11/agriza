'use strict';


const { ErrorHandler } = require('../../../../../lib/utils');
const Licensedetails = require('../../../../../models/be_license_details');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    //Get logged in user
    let check = await Licensedetails.where({ id: req.params.id }).fetch({ require: false });
    if (!check)
      return res.serverError(400, ErrorHandler(new Error(' business License details not found')));
    await new Licensedetails().where({ id: req.params.id }).save({ active_status: constants.activeStatus.deleted }, { method: 'update' })
      .then(() => {
        return res.success({ 'message': ' business License details deleted successfully' });
      })
      .catch(err => {
        return res.serverError(400, ErrorHandler('Something went wrong'));
      })
  } catch (error) {
    console.log('errorrr', error);
    return res.serverError(500, ErrorHandler(error));
  }
};


