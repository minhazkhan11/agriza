
'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Tehsil = require('../../../../../models/tehsil');
const State = require('../../../../../models/state');
const Country = require('../../../../../models/country');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        const tehsilList = await Tehsil.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .orderBy('created_at', 'asc');
        }).fetchAll({
            require: false,
            withRelated: [{
                'district': function (query) {
                    query.select('id', 'district_name', 'state_id', 'country_id');
                }
            }]
        });

        const tehsilData = await Promise.all(tehsilList.map(async (tehsil) => {
            const district = tehsil.related('district');
            const state = await State.where({ id: district.get('state_id') }).fetch({ require: false });
            const country = await Country.where({ id: district.get('country_id') }).fetch({ require: false });

            return {
                id: tehsil.get('id'),
                active_status: tehsil.get('active_status'),
                tehsil_name: tehsil.get('tehsil_name'),
                district_name: district.get('district_name'),
                state_name: state ? state.get('state_name') : null,
                country_name: country ? country.get('country_name') : null
            };
        }));

        return res.success({
            tehsil: tehsilData,
            count: tehsilData.length
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
