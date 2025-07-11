'use strict';
const { ErrorHandler, sendOtp } = require('../../../../../lib/utils');
const User = require('../../../../../models/users');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let userBody = req.body.user;
    if (!Array.isArray(userBody.business_category_ids)) {
      return res.serverError(400, ErrorHandler('business_category_ids must be an array'));
    }
    // Assign menu_plan_id based on type
    if (userBody.type === "Buyer") {
      userBody.menu_plan_id = 7;
    } else if (userBody.type === "Seller") {
      userBody.menu_plan_id = 6;
    } else if (userBody.type === "Both") {
      userBody.menu_plan_id = 5;
    }

    const userCheck = await User
      .query((qb) => {
        qb.where(function () {
          this.where('phone', userBody.phone)
        });
        qb.orderBy('created_at', 'desc');
      })
      .fetch({ require: false, columns: ['id', 'phone', 'password', 'full_name', 'active_status'] });
    const userCheckData = userCheck ? userCheck.toJSON() : {};
    if (userCheck && userCheckData.active_status === 'active')
      return res.serverError(400, ErrorHandler('Phone Has Already Been taken'));
    if (userCheck && userCheckData.active_status === 'inactive')
      return res.serverError(400, ErrorHandler(constants.error.auth.inactiveUser));
    // otp generate

    const verification_code = Math.floor(1000 + Math.random() * 9000);
    const otpExpiration = Date.now() + 2 * 60 * 1000; // Set OTP expiration to 2 minutes from now
    console.log('verification_code', verification_code)
    delete req.session.userData;
    userBody.role = userBody.role === "Owner_Director" ? "admin" : "user";
    userBody.otp = verification_code;
    userBody.otpExpiration = otpExpiration;
    // send sms function call
    const sendOtpResult = await sendOtp(userBody.phone, verification_code);
    console.log(sendOtpResult);
    // Store user data in session
    req.session.userData = userBody;
    req.session.save();
    return res.success({ message: `OTP Sent To Your Registered Mobile number.` });
  } catch (error) {
    if (error instanceof SyntaxError)
      return res.serverError(400, ErrorHandler('Invalid JSON format in the user body'));
    return res.serverError(500, ErrorHandler(error));
  }
};


