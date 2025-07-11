'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const EntityBasic = require('../../../../../models/be_information');
const Attachment = require('../../../../../models/attachments');
const { uploadToS3Bucket, getObjectUrl } = require('../../../../../lib/utils/aws/s3');
const generateObjectKeyMultiple = require('../../../../../lib/utils/aws/s3/generateObjectKeyMultiple');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let { be_documents } = req.body;

    try {
      be_documents = JSON.parse(be_documents);
    } catch (err) {
      return res.serverError(400, ErrorHandler('Invalid JSON format in be_documents.'));
    }

    if (!be_documents.be_information_id) {
      return res.serverError(400, ErrorHandler('Missing required field: be_information_id.'));
    }

    let existingDocument = await EntityBasic.where({ id: be_documents.be_information_id }).fetch({ require: false });

    if (!existingDocument) {
      return res.serverError(400, ErrorHandler('be_information record not found.'));
    }
    if (Object.keys(be_documents).length > 1) {
      await existingDocument.save(be_documents, { patch: true });
    }

    let uploadedFiles = [];

    const fileFields = [
      { fieldName: "self_attested_pan", entityType: "self_attested_pan" },
      { fieldName: "self_attested_adhaar", entityType: "self_attested_adhaar" },
      { fieldName: "bank_statement", entityType: "bank_statement" },
      { fieldName: "attested_pan_of_the_partnership", entityType: "attested_pan_of_the_partnership" },
      { fieldName: "partnership_agreement", entityType: "partnership_agreement" },
      { fieldName: "attested_pan_of_the_authorized_signatory", entityType: "attested_pan_of_the_authorized_signatory" },
      { fieldName: "attested_adhaar_of_the_authorized_signatory", entityType: "attested_adhaar_of_the_authorized_signatory" },
      { fieldName: "any_local_registration_number_document", entityType: "any_local_registration_number_document" },
      { fieldName: "govt_license_of_the_retaller", entityType: "govt_license_of_the_retaller" },
      { fieldName: "signatory_photo", entityType: "signatory_photo" },
      { fieldName: "pan_of_the_company", entityType: "pan_of_the_company" },
      { fieldName: "certificate_of_incorporation", entityType: "certificate_of_incorporation" },
      { fieldName: "moa_of_the_company", entityType: "moa_of_the_company" },
      { fieldName: "aoa_of_the_company", entityType: "aoa_of_the_company" },
      { fieldName: "gst_returns_of_last_year", entityType: "gst_returns_of_last_year" },
      { fieldName: "gst_certificate", entityType: "gst_certificate" },
      { fieldName: "additional_documents", entityType: "additional_documents" },
    ];

    for (const { fieldName, entityType } of fileFields) {
      if (req.files && req.files[fieldName]) {
        for (const file of req.files[fieldName]) {
          // **Step 2: Mark previous active attachments as inactive**
          const existingAttachment = await Attachment.where({
            entity_id: be_documents.be_information_id,
            entity_type: entityType,
            active_status: constants.activeStatus.active
          }).fetch({ require: false });

          if (existingAttachment) {
            existingAttachment.set('active_status', constants.activeStatus.inactive);
            await existingAttachment.save();
          }
          const objectKey = generateObjectKeyMultiple("be_documents", entityType, file.originalname);
          await uploadToS3Bucket(objectKey, file.buffer);
          const fileUrl = await getObjectUrl(objectKey);

          const attachment = await new Attachment({
            entity_id: be_documents.be_information_id,
            entity_type: entityType,
            photo_path: fileUrl,
            added_by: req.user.id,
            active_status: constants.activeStatus.active
          }).save();

          uploadedFiles.push({
            id: attachment.id,
            field: fieldName,
            fileUrl
          });
        }
      }
    }
    const updatedDocument = await EntityBasic.where({ id: be_documents.be_information_id }).fetch({ require: false });

    if (!updatedDocument) {
      return res.serverError(404, ErrorHandler('Failed to fetch updated document.'));
    }

    let documentData = updatedDocument.toJSON();
    documentData.uploadedFiles = uploadedFiles;

    return res.success({
      message: 'be_documents updated successfully!',
      be_document: uploadedFiles
    });

  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
