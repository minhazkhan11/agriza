'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const User = require('../../../../../models/users');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {

    const id = req.body.staff_contacts.id;
    const Check = await User.query((qb) => {
      qb.where({ id }).whereIn('role', ['procurement', 'salesman']);
    }).fetch({ require: false })
    if (!Check)
      return res.serverError(400, ErrorHandler(' details not found'));

    const body = req.body.staff_contacts;
    const staff_contacts = await new User().where({ id }).save(body, { method: 'update' });

    return res.success({ staff_contacts });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};