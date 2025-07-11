'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Menu = require('../../../../../models/menu_plan');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    //Get logged in user
    let check = await Menu.where({ id: req.params.id }).fetch({ require: false });
    if (!check)
      return res.serverError(400, ErrorHandler(new Error(' Menu_plan not found')));
    await new Menu().where({ id: req.params.id }).save({ active_status: constants.activeStatus.deleted }, { method: 'update' })
      .then(() => {
        return res.success({ 'message': ' Menu_plan deleted successfully' });
      })
      .catch(err => {
        return res.serverError(400, ErrorHandler('Something went wrong'));
      })
  } catch (error) {
    console.log('errorrr', error);
    return res.serverError(500, ErrorHandler(error));
  }
};