'use strict';

const { ErrorHandler, updateImage, processAttachment } = require('../../../../../lib/utils');
const Entitybasic = require('../../../../../models/be_information');
const Attachments = require('../../../../../models/attachments');
const { constants } = require('../../../../../config');
const { uploadToS3Bucket, getObjectUrl } = require('../../../../../lib/utils/aws/s3');
const generateObjectKeyMultiple = require('../../../../../lib/utils/aws/s3/generateObjectKeyMultiple')

module.exports = async (req, res, next) => {
  try {
    let { be_information } = req.body;

    // Ensure be_information is always an object, even if empty
    if (typeof be_information === 'string') {
      try {
        be_information = JSON.parse(be_information);
      } catch (err) {
        console.error("JSON Parsing Error:", err);
        return res.serverError(400, ErrorHandler("Invalid JSON format in be_information."));
      }
    }

    be_information = be_information && typeof be_information === 'object' ? be_information : {};

    const id = be_information.id;
    if (!id) {
      return res.serverError(400, ErrorHandler("ID is required for update."));
    }

    let existingEntity = await Entitybasic.where({ id }).fetch({ require: false, withRelated: ['logo'] });
    if (!existingEntity) {
      return res.serverError(400, ErrorHandler("Data not found"));
    }


    await new Entitybasic().where({ id }).save(be_information, { method: 'update' });

    let logo = null;
    const file = req.files?.logo?.[0] || null;
    if (file) {
      console.log("Updating logo...");

      const existingLogo = await Attachments.where({
        entity_id: id,
        entity_type: 'logo',
        active_status: constants.activeStatus.active,
      }).fetch({ require: false });


      if (existingLogo) {
        await existingLogo.save({ active_status: constants.activeStatus.inactive }, { patch: true });
      }

      const objectKey = generateObjectKeyMultiple("be_information", "logo", file.originalname);
      await uploadToS3Bucket(objectKey, file.buffer);
      logo = await getObjectUrl(objectKey);

      await new Attachments({
        entity_id: id,
        entity_type: 'logo',
        photo_path: logo,
        added_by: req.user.id
      }).save();
    }


    const updatedEntity = await Entitybasic.where({ id }).fetch({
      require: false,
      withRelated: [{
        'logo': function (query) {
          query.where('active_status', constants.activeStatus.active);
        }
      }]
    });

    const entityData = updatedEntity.toJSON();

    entityData.logo = updatedEntity.related('logo') ? processAttachment(updatedEntity.related('logo').toJSON()) : null;

    return res.success({ be_information: entityData });

  } catch (error) {
    console.error("Update Error:", error);
    return res.serverError(500, ErrorHandler(error));
  }
};
