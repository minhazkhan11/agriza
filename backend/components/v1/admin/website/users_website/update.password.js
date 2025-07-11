"use strict";
const { ErrorHandler } = require('../../../../../lib/utils');
const User = require('../../../../../models/users');
const { constants } = require('../../../../../config');
const bcrypt = require("bcrypt");


module.exports = async (req, res) => {
  try {
    const { phone, otp, password } = req.body.user; // Change this line
    var sessionUserData = {}
    var allsessions = req?.sessionStore?.sessions
    var allKeys = Object.keys(allsessions);
    for (let index = allKeys.length - 1; index >= 0; index--) {
      const key = allKeys[index];
      if (allsessions[key]?.includes(phone)) {
        sessionUserData = JSON.parse(allsessions[key])
        sessionUserData = sessionUserData?.forgetPasswordData
        break;
      }
    }
    // Check if the OTP has expired
    // if (sessionUserData && sessionUserData.otpExpiration) {
    //   const currentTimestamp = Date.now();
    //   if (currentTimestamp > sessionUserData.otpExpiration) {
    //     return res.serverError(400, ErrorHandler('OTP Has Expired'));
    //   }
    // }
    // Check if the OTP matches
    // if (!sessionUserData || sessionUserData.otp != otp || sessionUserData.phone != phone)
    //   return res.serverError(400, ErrorHandler('Invalid Otp'));
    // Find the user by phone number
    const user = await User.where({ phone }).fetch({ require: false });
    if (!user)
      return res.serverError(400, ErrorHandler(constants.error.auth.userNotFound));
    const newPassword = bcrypt.hashSync(password, 10);
    console.log(newPassword);
    // If OTP is valid, update user status (e.g., mark as verified)
    await user.save({ password: password }, { method: "update" });
    req.session.destroy();
    // Respond with success message
    return res.success({ message: "Password Update Successfully" });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};