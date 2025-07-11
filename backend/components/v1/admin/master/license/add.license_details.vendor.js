'use strict';

const { ErrorHandler, uploadImage, processAttachment } = require('../../../../../lib/utils');
const Licensedetails = require('../../../../../models/license_details');
const { constants } = require('../../../../../config');
const GodownAddress = require('../../../../../models/godown_address');
const Attachment = require('../../../../../models/attachments');

module.exports = async (req, res) => {
  try {
    const licenses = req.body.license_details;
    const added_by = req.user.id;

    const responseData = [];

    for (const body of licenses) {
      // Prepare license details
      const licensePayload = {
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
        be_information_id: body.be_information_id,
        added_by: added_by,
      };

      const licensedetails = await new Licensedetails(licensePayload).save();

      // Save godown details
      for (const godown of body.godown_details || []) {
        await new GodownAddress({
          license_id: licensedetails.id,
          godown_address: godown.godown_address,
          place_id: godown.place_id,
          pincode_id: godown.pincode_id,
          added_by: added_by
        }).save();
      }

      // Handle attachments
      const attachments = [
        { key: "signatureandseal", type: "signatureandseal" },
        { key: "license", type: "license" }
      ];

      for (const attachment of attachments) {
        const path = body[attachment.key];
        if (path) {
          const existingAttachment = await Attachment.where({
            entity_id: licensedetails.id,
            entity_type: attachment.type,
            active_status: constants.activeStatus.active,
          }).fetch({ require: false });

          if (existingAttachment) {
            existingAttachment.set("active_status", constants.activeStatus.inactive);
            await existingAttachment.save();
          }

          await new Attachment({
            entity_id: licensedetails.id,
            entity_type: attachment.type,
            photo_path: path,
            added_by: added_by,
            active_status: constants.activeStatus.active,
          }).save();
        }
      }

      // Fetch full license info
      const newLicenseInfo = await Licensedetails.where({ id: licensedetails.id }).fetch({
        require: false,
        withRelated: ['signatureandseal', 'license']
      });

      if (!newLicenseInfo) continue;

      const licenseData = newLicenseInfo.toJSON();
      licenseData.signatureandseal = processAttachment(licenseData.signatureandseal);
      licenseData.license = processAttachment(licenseData.license);

      const godownDetails = await GodownAddress.where({ license_id: licensedetails.id }).fetchAll();
      licenseData.godown_details = godownDetails ? godownDetails.toJSON() : [];

      responseData.push(licenseData);
    }

    return res.success({ license_details: responseData });

  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
