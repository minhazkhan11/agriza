'use strict';

const bcrypt = require('bcrypt');
const { ErrorHandler } = require('../../../../../lib/utils');
const User = require('../../../../../models/users');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {

    const id = req.body.owner_details.id;
    const Check = await User.query((qb) => {
      qb.where({ id }).andWhere({ role: "admin" });
    }).fetch({ require: false })
    if (!Check)
      return res.serverError(400, ErrorHandler('owner details not found'));

    const body = req.body.owner_details;
    const ownerdetails = await new User().where({ id }).save(body, { method: 'update' });

    return res.success({ ownerdetails });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};