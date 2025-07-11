'use strict';

const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
const Telecaller = require('../../../../../models/telecallers');
const TelecallerList = require('../../../../../models/telecallersLists');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    // Fetch telecaller based on the provided ID
    const telecaller = await Telecaller.where({
      id: req.params.id,
      active_status: constants.activeStatus.active
    }).fetch({
      require: false,
      withRelated: ['attachment']
    });

    // Check if telecaller exists
    if (!telecaller)
      return res.serverError(400, 'Invalid telecaller ID');

    // Convert telecaller to JSON and process attachment
    let telecallerJson = telecaller.toJSON();
    telecallerJson.excel_file = processAttachment(telecallerJson.attachment);
    delete telecallerJson.attachment;

    // Fetch associated telecaller lists
    const telecallerLists = await TelecallerList.where({
      telecaller_id: telecallerJson.id,
      active_status: constants.activeStatus.active
    }).fetchAll({
      require: false
    });

    telecallerJson.telecallerLists = telecallerLists

    // Send success response with telecaller and associated lists
    return res.success({ telecaller: telecallerJson, });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
