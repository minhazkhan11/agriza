'use strict';

const { ErrorHandler, processAttachment } = require("../../../../../lib/utils");
const Licensedetails = require("../../../../../models/license_details");
const GodownAddress = require("../../../../../models/godown_address");
const { uploadToS3Bucket, getObjectUrl } = require('../../../../../lib/utils/aws/s3');
const generateObjectKeyMultiple = require('../../../../../lib/utils/aws/s3/generateObjectKeyMultiple');
const { constants } = require("../../../../../config");
const Attachment = require('../../../../../models/attachments');

module.exports = async (req, res) => {
  try {
    const body = req.body.license_details
    const added_by = req.user.id;

    if (!body.id) {
      return res.serverError(400, ErrorHandler("Missing required field: id."));
    }

    // **License Details Fetch**
    let existingLicense = await Licensedetails.where({ id: body.id }).fetch({ require: false });

    if (!existingLicense) {
      return res.serverError(400, ErrorHandler("License not found."));
    }

    // **Update License Details**
    await existingLicense.save({
      license_name: body.license_name,
      beneficiary_name: body.beneficiary_name,
      license_status: body.license_status,
      license_no: body.license_no,
      license_category_id: body.license_category_id,
      license_territory: body.license_territory,
      license_territory_id: body.license_territory_id,
      office_address: body.office_address,
      pin_code: body.pin_code,
      place_id: body.place_id,
      state: body.state,
      district: body.district,
      tehsil: body.tehsil,
      date_of_issue: body.date_of_issue,
      date_of_expiry: body.date_of_expiry,
      author_by_issue: body.author_by_issue,
      authority_name: body.authority_name,
      added_by: added_by
    }, { patch: true });

    // **Fetch Existing Godown Entries Correctly**
    const existingGodownData = await GodownAddress.where({ license_id: body.id }).fetchAll({ require: false });
    let existingGodowns = existingGodownData ? existingGodownData.toJSON() : [];

    // **Create Map for Quick Lookup**
    let existingGodownMap = new Map(existingGodowns.map(g => [g.id, g]));

    // **Godown Insert/Update Operations**
    for (const godown of body.godown_details || []) {
      if (godown.id && existingGodownMap.has(godown.id)) {
        // **Update Existing Godown**
        await GodownAddress.where({ id: godown.id }).save({
          godown_address: godown.godown_address,
          place_id: godown.place_id,
          pincode_id: godown.pincode_id,
          added_by: added_by
        }, { patch: true });
      }
      // else {
      //   // **Insert New Godown One by One**
      //   await new GodownAddress({
      //     license_id: body.id,
      //     godown_address: godown.godown_address,
      //     place_id: godown.place_id,
      //     pincode_id: godown.pincode_id,
      //     added_by: added_by
      //   }).save();
      // }
    }

    // Attachments Handling
    const attachments = [
      { key: "signatureandseal", type: "signatureandseal" },
      { key: "license", type: "license" },
    ];

    for (const attachment of attachments) {
      const path = body[attachment.key]; // Direct S3 URL from body

      if (path) {
        // Mark any existing active attachment of this type as inactive
        const existingAttachment = await Attachment.where({
          entity_id: existingLicense.id,
          entity_type: attachment.type,
          active_status: constants.activeStatus.active,
        }).fetch({ require: false });

        if (existingAttachment) {
          await existingAttachment.save({ active_status: constants.activeStatus.inactive }, { patch: true });
        }

        // Save the new attachment record
        await new Attachment({
          entity_id: existingLicense.id,
          entity_type: attachment.type,
          photo_path: path,
          added_by: added_by,
          active_status: constants.activeStatus.active,
        }).save();
      }
    }


    // **Fetch Updated License Details with Godown Data**
    const updatedLicenseInfo = await Licensedetails.where({ id: body.id }).fetch({
      require: false,
      withRelated: ['signatureandseal', 'license']
    });
    const updatedGodownData = await GodownAddress.where({ license_id: body.id }).fetchAll({ require: false });

    let licenseData = updatedLicenseInfo.toJSON();
    licenseData.godown_details = updatedGodownData ? updatedGodownData.toJSON() : [];
    licenseData.signatureandseal = processAttachment(licenseData.signatureandseal);
    licenseData.license = processAttachment(licenseData.license);

    return res.success({ licenseData });

  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
