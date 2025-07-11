'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Activity = require('../../../../../models/order_activity');
const Attachment = require('../../../../../models/attachments');

module.exports = async (req, res) => {
  try {
    let body = req.body.order_activity;

    const activityImagePath = body.activity_image;
    delete body.activity_image;

    // Set added_by
    body.added_by = req.user.id;
    const order_activity = await new Activity(body).save();

    if (activityImagePath) {
      await new Attachment({
        entity_id: order_activity.id,
        entity_type: 'activity_image',
        photo_path: activityImagePath,
        added_by: req.user.id,
      }).save();
    }

    return res.success({ order_activity });

  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
