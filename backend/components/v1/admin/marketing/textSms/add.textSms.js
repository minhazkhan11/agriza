'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const TextSMS = require('../../../../../models/textSms');
const TextSMSuser = require('../../../../../models/textSmsUser');
const schedule = require('node-schedule');
const SmsConfig = require('../../../../../models/smsConfig');
const TemplateSms = require('../../../../../models/templateSms');
const { constants } = require('../../../../../config');
const axios = require('axios');
const moment = require('moment-timezone');


async function sendtextSms(phoneNumber, message, tempid, config) {
  const sendtextSmsPayload = {
    listsms: [
      {
        sms: message,
        mobiles: phoneNumber,
        senderid: config.sender_id,
        clientsmsid: config.client_sms_id,
        accountusagetypeid: "1",
        entityid: config.entity_id,
        tempid: tempid,

      }
    ],
    password: config.password,
    user: config.username,
  };
  console.log('sendtextSmsPayload', sendtextSmsPayload)
  try {
    const response = await axios.post('http://mobicomm.dove-sms.com//REST/sendsms/', sendtextSmsPayload);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

module.exports = async (req, res) => {
  try {
    let body = req.body.text;

    const config = await SmsConfig.where({
      added_by: req.user.id,
      active_status: constants.activeStatus.active
    }).fetch({ require: false });

    if (!config)
      return res.serverError(400, ErrorHandler('SMS config not found'));

    const configJson = config.toJSON();

    const template = await TemplateSms.where({
      id: body.template_id,
      added_by: req.user.id,
      status: 'approve',
      active_status: constants.activeStatus.active
    }).fetch({ require: false });

    console.log('tamplate', template);

    if (!template)
      return res.serverError(400, ErrorHandler('Invalid template_id'));

    const textsmsData = {
      campaign_name: body.campaign_name,
      message: body.message,
      type: body.type,
      added_by: req.user.id,
      status: body.date && body.time ? 'pending' : 'delivered'
    };

    if (body.date && body.time) {
      textsmsData.date = body.date;
      textsmsData.time = body.time;
    }

    const textsms = await new TextSMS(textsmsData).save();

    let senderData = [];

    if (Array.isArray(body.sender_name) && Array.isArray(body.phone) && body.sender_name.length === body.phone.length) {
      for (let i = 0; i < body.sender_name.length; i++) {
        senderData.push({
          text_sms_id: textsms.id,
          sender_name: body.sender_name[i],
          phone: body.phone[i],
          email: body.email[i],
          date: body.date,
          time: body.time,
          added_by: req.user.id,
          status: textsmsData.status
        });

        if (body.date && body.time) {
          const message = body.message.replace("{name}", body.sender_name[i]).replace("{phone}", body.phone[i]);
          scheduleMessage(body.date, body.time, body.phone[i], message, textsms.id, template.toJSON().template_id, configJson); // Pass configJson to scheduleMessage
        } else {
          const message = body.message.replace("{name}", body.sender_name[i]).replace("{phone}", body.phone[i]);
          await sendAndChangeStatus(textsms.id, body.phone[i], message, template.toJSON().template_id, configJson);
        }
      }
    } else {
      throw new Error("sender_name and phone must be arrays of the same length.");
    }

    const savedTextSMSusers = await Promise.all(senderData.map(data => new TextSMSuser(data).save()));

    let newtextsms = await TextSMS.where({ id: textsms.id }).fetch({ require: false });

    let newtextsmsuser = await TextSMSuser.where({ text_sms_id: textsms.id }).fetchAll({ require: false });

    let textData = newtextsms.toJSON();
    textData.textsmsuser = newtextsmsuser;

    return res.success({ msg: 'Text message sent successfully ', textData });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};

function scheduleMessage(date, time, phoneNumber, message, textSmsId, tempid, config) {
  const sendDateTime = convertToServerTimeZone(date, time, 'Asia/Kolkata'); // Change 'Asia/Kolkata' to your desired timezone
  const job = schedule.scheduleJob(sendDateTime, async function () {
    try {
      await sendAndChangeStatus(textSmsId, phoneNumber, message, tempid, config);
      console.log('Message  sent successfully');
    } catch (error) {
      console.error('Error sending scheduled message:', error);
    }
  });
}

// Function to convert time to a specific timezone
function convertToServerTimeZone(date, time, timezone) {
  const dateTimeString = `${date}T${time}`;
  const sendDateTime = moment.tz(dateTimeString, timezone).toDate();
  return sendDateTime;
}

async function sendAndChangeStatus(textSmsId, phoneNumber, message, tempid, config) {
  await sendtextSms(phoneNumber, message, tempid, config);
  await TextSMS.where({ id: textSmsId }).save({ status: 'delivered' }, { patch: true });
  await TextSMSuser.where({ text_sms_id: textSmsId }).save({ status: 'delivered' }, { patch: true });
}
