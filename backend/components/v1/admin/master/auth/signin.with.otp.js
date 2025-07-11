'use strict';
const { ErrorHandler, sendOtp } = require('../../../../../lib/utils');
const User = require('../../../../../models/users');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const { username } = req.body.user;
    if (!username) {
      return res.status(400).json({ message: 'Phone number is required for sign-in' });
    }
    const user = await User.where({
      phone: username,
      active_status: constants.activeStatus.active
    }).fetch({ require: false });

    if (!user) {
      return res.status(402).json({ message: 'Invalid phone number or user not found' });
    }
    const verification_code = Math.floor(1000 + Math.random() * 9000);
    const otpExpiration = Date.now() + 2 * 60 * 1000;
    const sendOtpResult = await sendOtp(username, verification_code);
    console.log(sendOtpResult);
    req.session.userData = {
      phone: username,
      otp: verification_code,
      otpExpiration: otpExpiration
    };
    return res.success({ message: `OTP sent to your registered mobile number.` });
  } catch (error) {
    // Customize the error message for "EmptyResponse"
    if (error.message === 'EmptyResponse')
      return res.status(402).json({ message: 'Invalid phone number or user not found' });
    return res.status(500).json({ error: ErrorHandler(error) });
  }
};