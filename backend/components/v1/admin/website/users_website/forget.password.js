'use strict';
const { ErrorHandler, sendOtp } = require('../../../../../lib/utils');
const User = require('../../../../../models/users');
const { constants } = require('../../../../../config');
const session = require('express-session'); // Import express-session
module.exports = async (req, res) => {
  try {
    const { phone } = req.body.user;
    // Find the user by phone number
    const user = await User.where({ phone, active_status: constants.activeStatus.active }).fetch({ require: false });
    if (!user) {
      return res.serverError(400, ErrorHandler(constants.error.auth.userNotFound));
    }
    // otp genrate
    const verification_code = Math.floor(1000 + Math.random() * 9000);
    const otpExpiration = Date.now() + 2 * 60 * 1000; // Set OTP expiration to 2 minutes from now
    // otp send registerd mobile number
    await sendOtp(phone, verification_code);
    req.session.forgetPasswordData = null;
    req.session.forgetPasswordData = {
      phone: phone,
      otp: verification_code,
      otpExpiration: otpExpiration // Store the OTP expiration timestamp in the session
    };
    // Respond with success message
    // return res.success({ message: verification_code + ' otp send your registerd mobile number' });
    return res.success({ message: ' Otp Send Your Registerd Mobile Number' });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};