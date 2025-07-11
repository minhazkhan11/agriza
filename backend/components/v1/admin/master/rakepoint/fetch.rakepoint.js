'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Rakepoint = require('../../../../../models/rakepoint');
const Place = require('../../../../../models/place');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
    try {
        // **Fetch All Rakepoints**
        const rakepoints = await Rakepoint.query(qb => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .orderBy('created_at', 'asc');
        }).fetchAll();

        if (!rakepoints || rakepoints.length === 0) {
            return res.success({ rakepoints: [], count: 0 });
        }

        let rakepointsJson = rakepoints.toJSON();

        // Extract unique place IDs from rakepoints
        const placeIds = [...new Set(rakepointsJson.map(rp => rp.place_id).filter(id => id))];

        // Fetch places only if placeIds exist
        let placeDataMap = {};
        if (placeIds.length > 0) {
            const places = await Place.query(qb => {
                qb.whereIn('id', placeIds)
                  .whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                  .orderBy('created_at', 'asc');
            }).fetchAll({
                require: false,
                withRelated: [
                    { 'pin': (query) => query.select('id', 'pin_code', 'tehsil_id') },
                    { 'pin.tehsil': (query) => query.select('id', 'tehsil_name', 'district_id') },
                    { 'pin.tehsil.district': (query) => query.select('id', 'district_name', 'state_id', 'country_id') },
                    { 'pin.tehsil.district.state': (query) => query.select('id', 'state_name') },
                    { 'pin.tehsil.district.country': (query) => query.select('id', 'country_name') }
                ]
            });

            // Convert places list into a map for quick lookup
            placeDataMap = places.toJSON().reduce((acc, place) => {
                const pin = place.pin;
                const tehsil = pin ? pin.tehsil : null;
                const district = tehsil ? tehsil.district : null;
                const state = district ? district.state : null;
                const country = district ? district.country : null;

                acc[place.id] = {
                    id: place.id,
                    place_name: place.place_name,
                    pin_id: place.pin_id,
                    pin_code: pin ? pin.pin_code : null,
                    active_status: place.active_status,
                    tehsil_name: tehsil ? tehsil.tehsil_name : null,
                    district_name: district ? district.district_name : null,
                    state_name: state ? state.state_name : null,
                    country_name: country ? country.country_name : null
                };
                return acc;
            }, {});
        }

        // **Merge Place Data into Rakepoints**
        const rakepointData = rakepointsJson.map(rakepoint => ({
            id: rakepoint.id,
            rack_point: rakepoint.rack_point,
            place_id: rakepoint.place_id,
            rack_point_distanse: rakepoint.rack_point_distanse,
            place: placeDataMap[rakepoint.place_id] || null ,// Attach place data,
            active_status:rakepoint.active_status 
        }));

        return res.success({
            rakepoints: rakepointData,
            count: rakepointData.length
        });

    } catch (error) {
        return res.serverError(500, { error: ErrorHandler(error) });
    }
};
