'use strict';


const { ErrorHandler } = require('../../../../../lib/utils');
const User = require('../../../../../models/users');
const { constants } = require('../../../../../config');



module.exports = async (req, res, next) => {
  try {
    const { full_name, phone, password } = req.body.user;


    let existingUser = await User.where({ phone }).fetch({ require: false });
    if (existingUser) {
      return res.serverError(422, ErrorHandler(new Error('User Already Exists')));
    }

    const addedBy = req.user.id;
    // Create new user
    let newUser = await new User({
      full_name,
      phone,
      password,
      active_status: constants.activeStatus.active,
      added_by: addedBy,
      role: 'buyer'
    }).save();

    return res.success({ message: 'User Registered Successfully', user: newUser });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
