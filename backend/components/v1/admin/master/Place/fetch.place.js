

'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Place = require('../../../../../models/place');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        // Fetch places along with pin, tehsil, district, state, and country in a single query
        const place = await Place.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .orderBy('created_at', 'asc');
        }).fetchAll({
            require: false,
            withRelated: [
                {
                    'pin': (query) => query.select('id', 'pin_code', 'tehsil_id'),
                },
                {
                    'pin.tehsil': (query) => query.select('id', 'tehsil_name', 'district_id'),
                },
                {
                    'pin.tehsil.district': (query) => query.select('id', 'district_name', 'state_id', 'country_id'),
                },
                {
                    'pin.tehsil.district.state': (query) => query.select('id', 'state_name'),
                },
                {
                    'pin.tehsil.district.country': (query) => query.select('id', 'country_name'),
                }
            ]
        });

        if (!place || place.length === 0) {
            return res.success({ place: [], count: 0 });
        }

        // Transform the data to ensure a flat structure
        const placeData = place.map((place) => {
            const pin = place.related('pin');
            const tehsil = pin ? pin.related('tehsil') : null;
            const district = tehsil ? tehsil.related('district') : null;
            const state = district ? district.related('state') : null;
            const country = district ? district.related('country') : null;

            return {
                id: place.get('id'),
                place_name: place.get('place_name'),
                pin_id: place.get('pin_id'),
                pin_code: pin ? pin.get('pin_code') : null,
                added_by: place.get('added_by'),
                active_status: place.get('active_status'),
                created_at: place.get('created_at'),
                updated_at: place.get('updated_at'),
                tehsil_name: tehsil ? tehsil.get('tehsil_name') : null,
                district_name: district ? district.get('district_name') : null,
                state_name: state ? state.get('state_name') : null,
                country_name: country ? country.get('country_name') : null
            };
        });

        return res.success({
            place: placeData,
            count: placeData.length
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};

