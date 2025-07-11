'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Attachments = require('../../../../../models/attachments');
const Entitybasic = require('../../../../../models/be_information');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    const { be_information_id } = req.params;

    if (!be_information_id) {
      return res.serverError(400, ErrorHandler('Missing required parameter: be_information_id.'));
    }
    const entityExists = await Entitybasic.where({ id: be_information_id }).fetch({ require: false });

    if (!entityExists) {
      return res.serverError(404, ErrorHandler('Invalid be_information_id. No matching record found.'));
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

    const attachments = await Attachments.where({
      entity_id: be_information_id,
      active_status: constants.activeStatus.active
    })
      .where('entity_type', 'IN', allowedFields)
      .orderBy('created_at', 'desc')
      .fetchAll({ require: false });

    let uploadedFiles = [];

    if (attachments && attachments.length > 0) {
      uploadedFiles = attachments.toJSON().map(attachment => ({
        id: attachment.id,
        be_information_id: attachment.entity_id,
        field: attachment.entity_type,
        fileUrl: attachment.photo_path
      }));
    }

    return res.success({
      message: 'Fetched uploaded documents successfully!',
      be_document: uploadedFiles
    });

  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
