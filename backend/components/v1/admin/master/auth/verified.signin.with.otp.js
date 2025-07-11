'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const User = require('../../../../../models/users');
const Assigned = require('../../../../../models/assigned_to');
const Entitybasic = require('../../../../../models/be_information');
const Bankdetails = require('../../../../../models/be_bank_details');
// const Licensedetails = require('../../../../../models/be_license_details');
const { constants } = require('../../../../../config');
const passportMiddleWare = require('../../../../../middlewares/passport.middleware');

module.exports = async (req, res) => {
  try {
    const phone = req.body.user.phone;
    const otp = req.body.user.otp;
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
    let user = await User.where({ phone: phone }).fetch({ require: false });
    // Check if the OTP has expired
    if (req.session.userData && req.session.userData.otpExpiration) {
      const currentTimestamp = Date.now();
      if (currentTimestamp > req.session.userData.otpExpiration) {
        return res.serverError(400, ErrorHandler('OTP has expired'));
      }
    }
    console.log('sessionUserData', sessionUserData)
    // Check if the OTP matches
    if (!sessionUserData || sessionUserData.otp != otp || sessionUserData.phone != phone) {
      return res.serverError(400, ErrorHandler('invalid otp'));
    }


    const assignedTo = await Assigned.where({ user_id: user.get('id') }).fetch({ require: false });

    let entityDetails = null;
    let bankDetails = null;
    // let licenseDetails = null;

    if (assignedTo) {
      const beInformationId = assignedTo.get('be_information_id');
      entityDetails = await Entitybasic.where({ id: beInformationId }).fetch({ require: false });
      bankDetails = await Bankdetails.where({ be_information_id: beInformationId }).fetch({ require: false });
      // licenseDetails = await Licensedetails.where({ be_information_id: beInformationId }).fetch({ require: false });
    }
    req.session.destroy();
    // Generate access tokens
    const tokenData = await passportMiddleWare.generateSignUpToken(user.toJSON());
    console.log(tokenData, "TokenData")

    const response = {
      message: 'OTP verified successfully',
      user: tokenData.user,
      token: tokenData.token,
      refresh_token: tokenData.refresh_token,
      assigned_to: assignedTo || null,
      entity_details: entityDetails || null,
      bank_details: bankDetails || null,
      // license_details: licenseDetails || null,
    };
    // Send the response with the message and token
    return res.success(response);
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};









