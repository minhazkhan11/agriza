'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Licensedetails = require('../../../../../models/license_details');
const State = require('../../../../../models/state');
const District = require('../../../../../models/district');
const Pincode = require('../../../../../models/pin');
const Tehsil = require('../../../../../models/tehsil');
const Place = require('../../../../../models/place');
const Country = require('../../../../../models/country');
const GodownAddress = require('../../../../../models/godown_address');
const { constants } = require('../../../../../config');

// **Territory Mapping**
const territoryMap = {
  State: { model: State, column: 'state_name' },
  District: { model: District, column: 'district_name' },
  Pincode: { model: Pincode, column: 'pin_code' },
  Tehsil: { model: Tehsil, column: 'tehsil_name' },
  Place: { model: Place, column: 'place_name' },
  Country: { model: Country, column: 'country_name' }
};

module.exports = async (req, res) => {
  try {
    // **Fetch License Details**
    const newLicenseInfo = await Licensedetails.query(qb => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ added_by: req.user.id })
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      withRelated: {
        license_category: qb => qb.select('id', 'license_category_name'),
        pin_code: qb => qb.select('id', 'pin_code'),
        state: qb => qb.select('id', 'state_name'),
        district: qb => qb.select('id', 'district_name'),
        tehsil: qb => qb.select('id', 'tehsil_name'),
        place_id: qb => qb.select('id', 'place_name')
      },
      columns: ['id', 'license_name', 'beneficiary_name','license_status','license_no', 'license_category_id','license_territory','office_address', 'pin_code','date_of_issue','date_of_expiry', 'author_by_issue','authority_name','active_status','district','tehsil','place_id','license_territory_id','license_category_id']
    });

    if (!newLicenseInfo || newLicenseInfo.length === 0) {
      return res.success({ license_details: [] });
    }

    // **Fetch Territory Data Function**
    async function fetchTerritoryData(model, ids, columnName) {
      if (!ids) return null;

      let parsedIds = Array.isArray(ids)
        ? ids.map(num => parseInt(num, 10)).filter(num => !isNaN(num))
        : String(ids).split(',').map(num => parseInt(num.trim(), 10)).filter(num => !isNaN(num));

      if (parsedIds.length === 0) return null;

      const result = await model.query(qb => qb.whereIn('id', parsedIds)).fetchAll({
        require: false,
        columns: ['id', columnName]
      });

      return result ? result.toJSON()[0] || null : null;
    }

    // **Fetch Pincode Details**
    async function fetchPincodeDetails(pincodeIds) {
      if (!pincodeIds || pincodeIds.length === 0) return null;

      const pincodeData = await Pincode.query(qb => qb.whereIn('id', pincodeIds)).fetchAll({
        require: false,
        columns: ['id', 'pin_code']
      });

      return pincodeData ? pincodeData.toJSON().map(pin => ({ id: pin.id, name: pin.pin_code }))[0] || null : null;
    }

    // **Fetch Place Details**
    async function fetchPlaceDetails(placeIds) {
      if (!placeIds || placeIds.length === 0) return null;

      const placeData = await Place.query(qb => qb.whereIn('id', placeIds)).fetchAll({
        require: false,
        columns: ['id', 'place_name']
      });

      return placeData ? placeData.toJSON().map(place => ({ id: place.id, name: place.place_name }))[0] || null : null;
    }

    // **Fetch Godown Details**
    async function fetchGodownDetails(licenseId) {
      const godownData = await GodownAddress.where({ license_id: licenseId }).fetchAll({
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
      return godownData ? godownData.toJSON() : [];
    }

    let responseData = { license_details: [] };

    // **Loop through Each License**
    for (const license of newLicenseInfo.toJSON()) {
      let licenseData = { ...license };

      // **Territory Mapping**
      const { license_territory, license_territory_id, pincode } = licenseData;

      if (territoryMap[license_territory]) {
        const { model, column } = territoryMap[license_territory];
        licenseData.license_territory_id = await fetchTerritoryData(model, license_territory_id, column);
      }

      // **Attach Pincode Name**
      if (pincode) {
        licenseData.pincode = await fetchPincodeDetails([pincode]);
      }

      // **Attach Godown Details**
      licenseData.godown_details = await fetchGodownDetails(licenseData.id);

      responseData.license_details.push(licenseData);
    }

    return res.success(responseData);

  } catch (error) {
    console.error("Error fetching license details:", error);
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
