'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Suppliers = require('../../../../../models/suppliers');
const { constants } = require('../../../../../config');


module.exports = async (req, res, next) => {
  try {
    //Get logged in user
    let check = await Suppliers.where({ id: req.params.id }).fetch({ require: false });
    if (!check)
      return res.serverError(400, ErrorHandler(new Error(' Supplier not found')));
    await new Suppliers().where({ id: req.params.id }).save({ active_status: constants.activeStatus.deleted }, { method: 'update' })
      .then(() => {
        return res.success({ 'message': ' supplier_name deleted successfully' });
      })
      .catch(err => {
        return res.serverError(400, ErrorHandler('Something went wrong'));
      })
  } catch (error) {
    console.log('errorrr', error);
    return res.serverError(500, ErrorHandler(error));
  }
};
