
'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const { uploadToS3Bucket, getObjectUrl } = require('../../../../../lib/utils/aws/s3');
const generateObjectKeyMultiple = require('../../../../../lib/utils/aws/s3/generateObjectKeyMultiple');

module.exports = async (req, res) => {
  try {

    let { entitytype } = req.body;

    if (!entitytype) {
      return res.serverError(400, ErrorHandler('Missing required field: entitytype.'));
    }

    // Sanitize entitytype (Remove spaces & special characters)
    entitytype = entitytype.replace(/\s+/g, "_").toLowerCase();

    // Ensure files are uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.serverError(400, ErrorHandler('No files uploaded.'));
    }

    const fileFields = ["photo", "aadhar_upload", "pan_upload", "license_image", "order_image", "gst_file", "payments_image", "activity_image", "dispatch_image", "o_form", "license", "signatureandseal"];
    let uploadedFiles = {};

    for (const fieldName of fileFields) {
      if (req.files?.[fieldName]?.[0]) {
        const file = req.files[fieldName][0];

        // Use dynamic entitytype from req.body
        const objectKey = generateObjectKeyMultiple(entitytype, fieldName, file.originalname);

        // Upload to S3
        await uploadToS3Bucket(objectKey, file.buffer);
        const fileUrl = await getObjectUrl(objectKey);

        // Store URL in response object
        uploadedFiles[fieldName] = fileUrl;
      }
    }

    return res.success({
      message: 'Images uploaded successfully!',
      uploadedFiles
    });

  } catch (error) {
    console.error("Error:", error);
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
