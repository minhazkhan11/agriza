'use strict';
const bcrypt = require('bcrypt');
const { ErrorHandler } = require('../../../../../lib/utils');
const Warehouseinformation = require('../../../../../models/be_warehouse_information');
const { constants } = require('../../../../../config');
const User = require('../../../../../models/users')

module.exports = async (req, res, next) => {
  try {
    //Get logged in user
    let check = await Warehouseinformation.where({ id: req.params.id }).fetch({ require: false });
    if (!check)
      return res.serverError(400, ErrorHandler(new Error(' Warehouse information not found')));
    await new Warehouseinformation().where({ id: req.params.id }).save({ active_status: constants.activeStatus.deleted }, { method: 'update' })
      .then(() => {
        return res.success({ 'message': ' Warehouse information deleted successfully' });
      })
      .catch(err => {
        return res.serverError(400, ErrorHandler('Something went wrong'));
      })
  } catch (error) {
    console.log('errorrr', error);
    return res.serverError(500, ErrorHandler(error));
  }
};