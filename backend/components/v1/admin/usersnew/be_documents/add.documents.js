// 'use strict';

// const { ErrorHandler } = require('../../../../../lib/utils');
// const Attachment = require('../../../../../models/attachments');
// const { uploadToS3Bucket, getObjectUrl } = require('../../../../../lib/utils/aws/s3');
// const generateObjectKey = require('../../../../../lib/utils/aws/s3/generateObjectKey');
// const { constants } = require('../../../../../config');

// module.exports = async (req, res) => {
//   try {
//     const { be_information_id } = req.body;
//     if (!be_information_id) {
//       return res.serverError(400, ErrorHandler('Missing required field: be_information_id.'));
//     }

//     let uploadedFiles = [];

//     const fileFields = [
//       { fieldName: "self_attested_pan", entityType: "self_attested_pan" },
//       { fieldName: "bank_statement", entityType: "bank_statement" }
//     ];

//     for (const { fieldName, entityType } of fileFields) {
//       if (req.files[fieldName]) {
//         for (const file of req.files[fieldName]) {
//           const objectKey = generateObjectKey("be_information", be_information_id, file.originalname);
//           await uploadToS3Bucket(objectKey, file.buffer);
//           const fileUrl = await getObjectUrl(objectKey);

//           const attachment = await new Attachment({
//             entity_id: be_information_id,
//             entity_type: entityType,
//             photo_path: fileUrl,
//             added_by: req.user.id,
//             active_status: constants.activeStatus.active
//           }).save();

//           uploadedFiles.push({
//             id: attachment.id,
//             field: fieldName,
//             fileUrl
//           });
//         }
//       }
//     }

//     return res.success({
//       message: 'Documents uploaded successfully!',
//       uploadedFiles
//     });

//   } catch (error) {
//     return res.serverError(500, { error: ErrorHandler(error) });
//   }
// };


'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
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

    const { be_information_id } = be_documents;

    if (!be_information_id) {
      return res.serverError(400, ErrorHandler('Missing required field: be_information_id.'));
    }

    let be_document = [];

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
          await Attachment.where({
            entity_id: be_information_id,
            entity_type: entityType,
            active_status: constants.activeStatus.active
          })
            .query()
            .update({ active_status: constants.activeStatus.inactive });

          const objectKey = generateObjectKeyMultiple("be_documents", entityType, file.originalname);
          await uploadToS3Bucket(objectKey, file.buffer);
          const fileUrl = await getObjectUrl(objectKey);


          const attachment = await new Attachment({
            entity_id: be_information_id,
            entity_type: entityType,
            photo_path: fileUrl,
            added_by: req.user.id,
            active_status: constants.activeStatus.active
          }).save();

          be_document.push({
            id: attachment.id,
            field: fieldName,
            fileUrl
          });
        }
      }
    }

    const allowedFields = [
      "self_attested_pan",
      "self_attested_adhaar",
      "bank_statement",
      "attested_pan_of_the_partnership",
      "partnership_agreement",
      "attested_pan_of_the_authorized_signatory",
      "attested_adhaar_of_the_authorized_signatory",
      "any_local_registration_number_document",
      "govt_license_of_the_retaller",
      "signatory_photo",
      "pan_of_the_company",
      "certificate_of_incorporation",
      "moa_of_the_company",
      "aoa_of_the_company",
      "gst_returns_of_last_year",
      "gst_certificate",
      "additional_documents"
    ];

    const attachments = await Attachment.where({
      entity_id: be_information_id,
      active_status: constants.activeStatus.active
    })
      .where('entity_type', 'IN', allowedFields)
      .orderBy('created_at', 'desc')
      .fetchAll({ require: false });
    let uploadedFiles = {}; // Initialize as an array with an empty object
    if (attachments && attachments.length > 0) {
      uploadedFiles = attachments.toJSON().reduce((acc, attachment) => {
        acc[`${attachment.entity_type}_id`] = attachment.id; // Add document ID
        acc[attachment.entity_type] = attachment.photo_path; // Add document URL
        return acc;
      }, {});
    }
    // return res.success({
    //   message: 'Documents uploaded successfully!',
    //   be_document
    // });
    return res.success({
      message: 'Documents uploaded successfully!',
      be_information_id,
      // documents: be_document.reduce((acc, doc) => {
      //   acc[`${doc.field}_id`] = doc.id;
      //   acc[doc.field] = doc.fileUrl;
      //   return acc;
      // }, {}),
      be_document: uploadedFiles
    });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
