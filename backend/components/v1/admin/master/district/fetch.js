'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const District = require('../../../../../models/district');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        const districts = await District.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .orderBy('created_at', 'asc');
        }).fetchAll({
            require: false,
            withRelated: [
                { 'country': (query) => query.select('id', 'country_name') },
                { 'state': (query) => query.select('id', 'state_name') }
            ]
        });

        if (!districts || districts.length === 0) {
            return res.success({ districts: [], count: 0 });
        }

        // Formatting the response
        const districtData = districts.map((district) => {
            return {
                id: district.get('id'),
                district_name: district.get('district_name'),
                active_status: district.get('active_status'),
                created_at: district.get('created_at'),
                updated_at: district.get('updated_at'),
                country_name: district.related('country') ? district.related('country').get('country_name') : null,
                state_name: district.related('state') ? district.related('state').get('state_name') : null
            };
        });

        return res.success({
            districts: districtData,
            count: districtData.length
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
