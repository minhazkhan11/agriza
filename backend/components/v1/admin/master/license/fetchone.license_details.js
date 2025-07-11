'use strict';

const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
const Licensedetails = require('../../../../../models/license_details');
const State = require('../../../../../models/state');
const District = require('../../../../../models/district');
const Pincode = require('../../../../../models/pin');
const Tehsil = require('../../../../../models/tehsil');
const Place = require('../../../../../models/place');
const Country = require('../../../../../models/country');
const { constants } = require('../../../../../config');
const Attachment = require('../../../../../models/attachments');
const GodownAddress = require('../../../../../models/godown_address');

module.exports = async (req, res) => {
  try {
    const newLicenseInfo = await Licensedetails.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ id: req.params.id })
        .orderBy('created_at', 'asc');
    }).fetch({
      require: false,
      withRelated: ['signatureandseal', 'license', {
        'license_category': qb => qb.select('id', 'license_category_name'),
        'pin_code': qb => qb.select('id', 'pin_code'),
        'state': qb => qb.select('id', 'state_name'),
        'district': qb => qb.select('id', 'district_name'),
        'tehsil': qb => qb.select('id', 'tehsil_name'),
        'place_id': qb => qb.select('id', 'place_name')
      }]
    });

    if (!newLicenseInfo) {
      return res.status(404).json({ success: false, message: 'License not found' });
    }

    let license_details = newLicenseInfo.toJSON();

    // Fetch Attachments
    const fetchAttachment = async (entityType) => {
      const attachment = await Attachment.where({
        entity_id: license_details.id,
        entity_type: entityType,
        active_status: constants.activeStatus.active
      }).orderBy('created_at', 'asc').fetch({ require: false });
      return attachment ? processAttachment(attachment.toJSON()) : null;
    };

    license_details.signatureandseal = await fetchAttachment('signatureandseal');
    // license_details.seal = await fetchAttachment('seal');
    license_details.license = await fetchAttachment('license');

    // Fetch Place Details for Godown
    async function fetchGodownPlaceDetails(placeIds) {
      if (!placeIds || placeIds.length === 0) return null;
      const placeData = await Place.query(qb => qb.whereIn('id', placeIds)).fetchAll({
        require: false,
        columns: ['id', 'place_name']
      });
      return placeData ? placeData.toJSON() : null;
    }

    // Fetch Pincode Details for Godown
    async function fetchPincodeDetails(pincodeIds) {
      if (!pincodeIds || pincodeIds.length === 0) return null;
      const pincodeData = await Pincode.query(qb => qb.whereIn('id', pincodeIds)).fetchAll({
        require: false,
        columns: ['id', 'pin_code']
      });
      return pincodeData ? pincodeData.toJSON() : null;
    }

    if (license_details.godown_place_id) {
      license_details.godown_place_id = await fetchGodownPlaceDetails(license_details.godown_place_id);
    }

    if (license_details.godown_pincode) {
      license_details.godown_pincode = await fetchPincodeDetails(license_details.godown_pincode);
    }

    // **Fetch License Products**
        const godownData = await GodownAddress.where({ license_id: license_details.id }).fetchAll({
               require: false ,
               withRelated: [{
                'pincode_id': function (query) {
                    query.select('id','pin_code' );
                },
                'place_id': function (query) {
                  query.select('id', 'place_name');
              }
            }],
            columns: ['id', 'godown_address', 'pincode_id','place_id']
             });
    
        license_details.godowndetails = godownData ? godownData.toJSON() : [];

    return res.success({
      license_details
    });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
