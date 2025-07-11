'use strict';

const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
const Licensedetails = require('../../../../../models/license_details');
const LicenseProduct = require('../../../../../models/license_product');
const { constants } = require('../../../../../config');
const Attachment = require('../../../../../models/attachments');

module.exports = async (req, res) => {
  try {
    const newLicenseInfo = await Licensedetails.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ id: req.params.id })
        .orderBy('created_at', 'asc');
    }).fetch({
      require: false,
      withRelated: ['signatureandseal', 'license'],
      columns: [
        'id', 'beneficiary_name', 'license_status', 'license_no',
        'date_of_issue', 'date_of_expiry', 'author_by_issue', 'authority_name'
      ]
    });

    if (!newLicenseInfo) {
      return res.status(404).json({ success: false, message: 'License not found' });
    }

    let license_details = newLicenseInfo.toJSON();

    // **Fetch Attachments**
    const fetchAttachment = async (entityType) => {
      const attachment = await Attachment.where({
        entity_id: license_details.id,
        entity_type: entityType,
        active_status: constants.activeStatus.active
      }).orderBy('created_at', 'asc').fetch({ require: false });
      return attachment ? processAttachment(attachment.toJSON()) : null;
    };

    license_details.signatureandseal = await fetchAttachment('signatureandseal');
    license_details.license = await fetchAttachment('license');

    // **Fetch License Products**
    const licenseProducts = await LicenseProduct.query(qb => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere('be_license_id', license_details.id)
        .orderBy('created_at', 'asc');
    }).fetchAll({ require: false, columns: ['id', 'name_of_product', 'brand_name'] });

    license_details.license_product = licenseProducts ? licenseProducts.toJSON() : [];

    return res.success({
      self_form: license_details
    });

  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
