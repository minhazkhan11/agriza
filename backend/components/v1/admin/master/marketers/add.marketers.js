
'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Marketers = require('../../../../../models/marketers');
const Attachment = require('../../../../../models/attachments');
const { uploadToS3Bucket, getObjectUrl } = require('../../../../../lib/utils/aws/s3');
const generateObjectKey = require('../../../../../lib/utils/aws/s3/generateObjectKey')
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let { marketers } = req.body;

    try {
      marketers = JSON.parse(marketers);
    } catch (err) {
      return res.serverError(400, ErrorHandler('Invalid JSON format in marketers data.'));
    }


    if (!marketers.marketer_name) {
      return res.serverError(400, ErrorHandler('Missing required fields: marketer_name.'));
    }

    marketers.added_by = req.user.id;


    let marketer = await Marketers.query(qb => {
      qb.where('marketer_name', marketers.marketer_name)
        .whereIn('active_status', ['active', 'inactive']);
    }).fetch({ require: false });

    if (marketer) {
      if (req.user.role === 'superadmin') {
        marketers.active_status = constants.activeStatus.active;
      } else {
        marketers.active_status = constants.activeStatus.pending;
      }
      await marketer.save(marketers, { patch: true });
    } else {

      if (req.user.role === 'superadmin') {
        marketers.active_status = constants.activeStatus.active;
      } else {
        marketers.active_status = constants.activeStatus.pending;
      }

      marketer = await new Marketers(marketers).save();
    }

    let photoUrl = null;

    if (req.files?.photo?.[0]) {
      const file = req.files.photo[0];
      const objectKey = generateObjectKey("marketers", file.originalname);
      await uploadToS3Bucket(objectKey, file.buffer);
      photoUrl = await getObjectUrl(objectKey);

      await new Attachment({
        entity_id: marketer.id,
        entity_type: 'marketer_photo',
        photo_path: photoUrl,
        added_by: req.user.id
      }).save();
    }

    const updatedMarketer = await Marketers.where({ id: marketer.id }).fetch({ require: false });

    if (!updatedMarketer) {
      return res.serverError(404, ErrorHandler('Failed to fetch updated marketer.'));
    }

    let marketerData = updatedMarketer.toJSON();
    marketerData.photoUrl = photoUrl || null;

    return res.success({ marketers: marketerData });


  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
