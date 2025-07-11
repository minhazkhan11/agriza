'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Marketers = require('../../../../../models/marketers');
const Attachment = require('../../../../../models/attachments');
const { uploadToS3Bucket, getObjectUrl } = require('../../../../../lib/utils/aws/s3');
const generateObjectKey = require('../../../../../lib/utils/aws/s3/generateObjectKey');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let { marketers } = req.body;

    try {
      marketers = JSON.parse(marketers);
    } catch (err) {
      return res.serverError(400, ErrorHandler('Invalid JSON format in marketers data.'));
    }

    if (!marketers.id) {
      return res.serverError(400, ErrorHandler('Missing required field: id.'));
    }

    let existingMarketer = await Marketers.where({ id: marketers.id }).fetch({ require: false });

    if (!existingMarketer) {
      return res.serverError(400, ErrorHandler('Marketer not found.'));
    }

    if (Object.keys(marketers).length > 1) {
      await existingMarketer.save(marketers, { patch: true });
    }

    let photo = null;

    if (req.files?.photo?.[0]) {
      const file = req.files.photo[0];

      // **Step 1: Purani Image Ko Inactive Karein**
      const existingAttachment = await Attachment.where({
        entity_id: marketers.id,
        entity_type: 'marketer_photo',
        active_status: constants.activeStatus.active
      }).fetch({ require: false });

      if (existingAttachment) {
        existingAttachment.set('active_status', constants.activeStatus.inactive);
        await existingAttachment.save();
      }


      const objectKey = generateObjectKey("marketers", marketers.id, file.originalname);
      await uploadToS3Bucket(objectKey, file.buffer);
      photo = await getObjectUrl(objectKey);

      await new Attachment({
        entity_id: marketers.id,
        entity_type: 'marketer_photo',
        photo_path: photo,
        added_by: req.user.id,
      }).save();
    }

    const updatedMarketer = await Marketers.where({ id: marketers.id }).fetch({ require: false });

    if (!updatedMarketer) {
      return res.serverError(404, ErrorHandler('Failed to fetch updated marketer.'));
    }

    let marketerData = updatedMarketer.toJSON();
    marketerData.photo = photo || null;

    return res.success({ marketers: marketerData });

  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
