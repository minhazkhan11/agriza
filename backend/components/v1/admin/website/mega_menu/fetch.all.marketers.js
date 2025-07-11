'use strict';

const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
const Marketers = require('../../../../../models/marketers');
const Attachments = require('../../../../../models/attachments');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const marketers = await Marketers.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .orderBy('created_at', 'asc');
    }).fetchAll({ require: false });

    let processedMarketers = [];

    for (const marketer of marketers) {
      let marketerData = marketer.toJSON();

      // Fetch only the first active marketer image
      let attachment = await Attachments.where({
        entity_id: marketer.id,
        entity_type: 'marketer_photo',
        active_status: constants.activeStatus.active // Fetch only active images
      }).orderBy('created_at', 'asc').fetch({ require: false });

      marketerData.photo = attachment ? processAttachment(attachment.toJSON()) : null;

      marketerData.name = `${marketerData.marketer_name} (${marketerData.alias_name})`;

      processedMarketers.push(marketerData);

    }

    return res.success({
      marketers: processedMarketers,
      count: processedMarketers.length
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
