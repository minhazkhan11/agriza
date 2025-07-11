'use strict'

'use strict';
const { ErrorHandler, sendOtp } = require('../../../../../lib/utils');
const User = require('../../../../../models/users');
const { constants } = require('../../../../../config');
const axios = require('axios');
const session = require('express-session');



module.exports = async (req, res) => {
  try {

    let phone = req.body.user.phone;
    const user = await User.where({ phone }).fetch({ require: false });

    if (!req.body.user || !phone) {
      return res.serverError(400, ErrorHandler('Phone Number Not Found'));
    }

    // Check if the OTP matches
    var sessionUserData = {}
    var allsessions = req?.sessionStore?.sessions
    var allKeys = Object.keys(allsessions);
    for (let index = allKeys.length - 1; index >= 0; index--) {
      const key = allKeys[index];
      if (allsessions[key]?.includes(phone)) {
        sessionUserData = JSON.parse(allsessions[key])
        sessionUserData = sessionUserData?.userData
        break;
      }
    }

    if (!user && (!sessionUserData || sessionUserData.phone !== req.body.user.phone)) {
      return res.serverError(400, ErrorHandler('Phone Number Does Not Match'));
    }

    const verification_code = Math.floor(1000 + Math.random() * 9000);
    const otpExpiration = Date.now() + 2 * 60 * 1000; // Set OTP expiration to 2 minutes from now
    sessionUserData.otp = verification_code;
    req.session.userData = sessionUserData;
    req.session.userData.otp = verification_code;
    req.session.userData.otpExpiration = otpExpiration;

    const sendOtpResult = await sendOtp(phone, verification_code);
    console.log(sendOtpResult);

    // if (user) {
    //   await user.save({ otp: verification_code }, { method: "update" });
    // }
    return res.success({ message: 'OTP Sent To Your Registered Mobile Number.' });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
}