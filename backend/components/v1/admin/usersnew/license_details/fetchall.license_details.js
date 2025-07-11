'use strict';


const { ErrorHandler, uploadImage, processAttachment } = require('../../../../../lib/utils');
const Licensedetails = require('../../../../../models/be_license_details');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {

    const newlicenseInfo = await Licensedetails.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false, withRelated: ['signature', 'seal', 'license'],

      withRelated: [{
        'be_information_id': function (query) {
          query.select('id', 'business_name');
        }
      }]
    });

    // const newlicenseInfo = await Licensedetails.where({ id: req.params.id }).fetch({
    //   require: false,
    //   withRelated: ['signature', 'seal', 'license'],
    // });

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