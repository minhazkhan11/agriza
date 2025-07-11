'use strict';

const bcrypt = require('bcrypt');
const { ErrorHandler } = require('../../../../../lib/utils');
const User = require('../../../../../models/users');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    //Get logged in user
    const check = await User.query((qb) => {
      qb.where({ id: req.params.id }).andWhere({ role: "admin" });
    }).fetch({ require: false })
    if (!check)
      return res.serverError(400, ErrorHandler(new Error('owner details not found')));
    await new User().where({ id: req.params.id }).save({ active_status: constants.activeStatus.deleted }, { method: 'update' })
      .then(() => {
        return res.success({ 'message': ' owner details deleted successfully' });
      })
      .catch(err => {
        return res.serverError(400, ErrorHandler('Something went wrong'));
      })
  } catch (error) {
    console.log('errorrr', error);
    return res.serverError(500, ErrorHandler(error));
  }
};