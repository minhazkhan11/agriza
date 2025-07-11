
'use strict';

const { ErrorHandler, uploadImage, processAttachment } = require('../../../../../lib/utils');
const Licensedetails = require('../../../../../models/be_license_details');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let { license_details } = req.body;
    license_details = JSON.parse(license_details); // Parse JSON body

    // Validate input
    if (!Array.isArray(license_details) || license_details.length === 0) {
      return res.serverError(400, ErrorHandler('Invalid input data format'));
    }

    const added_by = req.user.id;
    const licenseTypes = license_details.map((item) => item.license_type);

    // Check for existing license types
    const existingRecords = await Licensedetails.query((qb) => {
      qb.whereIn('license_type', licenseTypes).whereIn('active_status', ['active', 'inactive']);
    }).fetchAll({ require: false });

    if (existingRecords && existingRecords.length > 0) {
      const existingTypes = existingRecords.map((record) => record.get('license_type'));
      return res.serverError(409, ErrorHandler(`License type(s) already exist: ${existingTypes.join(', ')}`));
    }

    const insertedLicenses = [];

    for (const body of license_details) {
      body.added_by = added_by;

      // Save License details
      const licensedetails = await new Licensedetails(body).save();

      // Handle additional attachments (signature, seal, license)
      const attachments = [
        { key: 'signature', type: 'signature' },
        { key: 'seal', type: 'seal' },
        { key: 'license', type: 'license' },
      ];

      for (const attachment of attachments) {
        const file = req.files?.[attachment.key]?.[0] || null;
        if (file) {
          await uploadImage(
            file,
            'Licensedetails',
            'Licensedetail',
            licensedetails.id,
            attachment.type,
            req.user.id
          );
        }
      }

      // Fetch updated license details with attachments
      const newLicenseInfo = await Licensedetails.where({ id: licensedetails.id }).fetch({
        require: false,
        withRelated: ['signature', 'seal', 'license'],
      });

      const licenseData = newLicenseInfo.toJSON();
      licenseData.signature = processAttachment(licenseData.signature);
      licenseData.seal = processAttachment(licenseData.seal);
      licenseData.license = processAttachment(licenseData.license);

      insertedLicenses.push(licenseData); // Only push the final processed data
    }

    return res.success({ license_details: insertedLicenses });

  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
