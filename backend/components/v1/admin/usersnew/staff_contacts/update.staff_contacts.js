'use strict';

const bcrypt = require('bcrypt');
const { ErrorHandler } = require('../../../../../lib/utils');
const User = require('../../../../../models/users');



module.exports = async (req, res, next) => {
  try {

    const id = req.body.staff_contacts.id;
    const Check = await User.query((qb) => {
      qb.where({ id }).whereIn('role', ['procurement', 'salesman']);
    }).fetch({ require: false })
    if (!Check)
      return res.serverError(400, ErrorHandler('Data not found'));


    const body = req.body.staff_contacts
    const data = await new User().where({ id }).save(body, { method: 'update' });

    const newData = await User.where({ id }).fetch({ require: false });

    return res.success({ staff_contacts: newData });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};