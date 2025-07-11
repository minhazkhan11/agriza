const axios = require('axios');
const { smsConfig } = require('../../config');

const sendOtp = async (phone, otp) => {
  const smsPayload = {
    sms: `Your one-time password is ${otp}. Please do not share this OTP with anyone. Pariksha Do, a product by Walrus Solutions Private Limited`,
    mobiles: phone,
    senderid: smsConfig.senderid,
    clientsmsid: smsConfig.clientsmsid,
    accountusagetypeid: "1",
    entityid: smsConfig.entityid,
    tempid: smsConfig.tempid,
  };
  const payload = {
    listsms: [smsPayload],
    password: smsConfig.password,
    user: smsConfig.user,
  };
  try {
    const response = await axios.post(smsConfig.url, payload);
    return response.data;
  } catch (error) {
    console.error('Error sending OTP:', error.message || error);
    throw error;
  }
};
module.exports = sendOtp;









