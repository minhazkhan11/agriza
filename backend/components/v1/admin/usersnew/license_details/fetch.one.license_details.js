'use strict';


const { ErrorHandler, uploadImage, processAttachment } = require('../../../../../lib/utils');
const Licensedetails = require('../../../../../models/be_license_details');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    const newlicenseInfo = await Licensedetails.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ id: req.params.id })
        .orderBy('created_at', 'asc');
    }).fetch({
      require: false,
      withRelated: ['signature', 'seal', 'license'],

    });
    if (!newlicenseInfo) {
      return res.status(404).json({ success: false, message: 'License not found or deleted.' });
    }


    // Convert the fetched data to JSON
    const license_details = newlicenseInfo.toJSON();

    // Process and transform the attachments
    license_details.signature = processAttachment(license_details.signature);
    license_details.seal = processAttachment(license_details.seal);
    license_details.license = processAttachment(license_details.license);

    return res.success({ license_details });

  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};