'use strict';

const { ErrorHandler, uploadImage, processAttachment } = require('../../../../../lib/utils');
const Attachments = require('../../../../../models/attachments');
const Entitybasic = require('../../../../../models/be_information');
const BeIdentityTable = require('../../../../../models/be_identity_table');
const BEModulePlansPpdation = require('../../../../../models/be_module_plans_updation');
const { constants } = require('../../../../../config');
const { uploadToS3Bucket, getObjectUrl } = require('../../../../../lib/utils/aws/s3');
const generateObjectKeyMultiple = require('../../../../../lib/utils/aws/s3/generateObjectKeyMultiple');

module.exports = async (req, res) => {
  try {
    let { be_information } = req.body;

    if (typeof be_information === 'string') {
      try {
        be_information = JSON.parse(be_information);
      } catch (err) {
        return res.serverError(400, ErrorHandler("Invalid JSON format in be_information."));
      }
    }

    const { entity_type } = be_information;
    const { gst_number, pan_number } = be_information;

    if (!gst_number && !pan_number) {
      return res.serverError(400, ErrorHandler("Either gst_number or pan_number must be provided."));
    }

    const { entity_type: _, ...entitybasicData } = be_information;

    entitybasicData.gst_pincode_id = entitybasicData.gst_pincode_id || null;
    entitybasicData.postal_pincode_id = entitybasicData.postal_pincode_id || null;

    const existingRecord = await Entitybasic
      .query((qb) => {
        qb.where(function () {
          if (gst_number) this.orWhere('gst_number', gst_number);
          if (pan_number) this.orWhere('pan_number', pan_number);
        }).whereIn('active_status', ['active', 'inactive']);
      })
      .fetch({ require: false });

    let savedRecord;

    if (!existingRecord) {
      entitybasicData.added_by = req.user.id;
      savedRecord = await new Entitybasic(entitybasicData).save();

      if (entity_type) {
        await new BeIdentityTable({
          be_id: savedRecord.id,
          added_by: req.user.id,
          entity_type: entity_type
        }).save();
      }
    } else {
      const identityRecord = await BeIdentityTable.where({ be_id: existingRecord.id }).fetch({ require: false });

      if (identityRecord) {
        const existingEntityType = identityRecord.get('entity_type');

        if (existingEntityType !== entity_type) {

          entitybasicData.added_by = req.user.id;
          savedRecord = await new Entitybasic(entitybasicData).save();

          await new BeIdentityTable({
            be_id: savedRecord.id,
            added_by: req.user.id,
            entity_type: entity_type
          }).save();
        } else {
          return res.serverError(400, ErrorHandler("This record is linked to BeIdentityTable and cannot be updated."));
        }
      } else {
        const previousModuleId = existingRecord.get('module_id');
        savedRecord = await existingRecord.save(entitybasicData, { patch: true });

        const newModuleId = savedRecord.get('module_id');

        if (previousModuleId === 1) {
          await savedRecord.save({ module_id: 1 }, { patch: true });
        } else {
          const updatedModulePlan = await BEModulePlansPpdation
            .where({ curent_module_plan_id: previousModuleId, new_module_plan_id: newModuleId })
            .fetch({ require: false });

          if (updatedModulePlan) {
            const updatedModulePlanId = updatedModulePlan.get('updated_module_plan_id');
            if (updatedModulePlanId) {
              await savedRecord.save({ module_id: updatedModulePlanId }, { patch: true });
            }
          }
        }
      }
    }

    let logo = null;
    if (req.files?.logo?.[0]) {
      const file = req.files.logo[0];
      const objectKey = generateObjectKeyMultiple("be_information", "logo", file.originalname);
      await uploadToS3Bucket(objectKey, file.buffer);
      logo = await getObjectUrl(objectKey);

      await new Attachments({
        entity_id: savedRecord.id,
        entity_type: 'logo',
        photo_path: logo,
        added_by: req.user.id
      }).save();
    }

    const updatedEntity = await Entitybasic.where({ id: savedRecord.id }).fetch({
      require: false,
      withRelated: [
        { 'constitutions_id': (query) => query.select('id', 'name') },
        { 'logo': (query) => query.where('active_status', constants.activeStatus.active) }
      ]
    });

    const entityData = updatedEntity.toJSON();
    entityData.logo = updatedEntity.related('logo')?.toJSON()
      ? processAttachment(updatedEntity.related('logo').toJSON())
      : null;

    return res.success({ be_information: entityData });

  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
