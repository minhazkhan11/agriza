// 'use strict';
// const { ErrorHandler } = require('../../../../../lib/utils');
// const Pin = require('../../../../../models/pin');
// const { constants } = require('../../../../../config');
// const District = require('../../../../../models/district');

// module.exports = async (req, res, next) => {
//     try {
//         const pin = await Pin.query((qb) => {
//             qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
//                 .orderBy('created_at', 'asc');
//         }).fetchAll({
//             require: false,
//             withRelated: [{
//                 'tehsil': function (query) {
//                     query.select('id', 'tehsil_name', 'district_id');
//                 }
//             }]
//         });

//         const count = pin.length;

//         return res.success({
//             pin, count
//         });

//     } catch (error) {
//         return res.serverError(500, ErrorHandler(error));
//     }
// };

'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Pin = require('../../../../../models/pin');
const { constants } = require('../../../../../config');
const District = require('../../../../../models/district');
const State = require('../../../../../models/state');
const Country = require('../../../../../models/country');

module.exports = async (req, res, next) => {
    try {
        const pinList = await Pin.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .orderBy('created_at', 'asc');
        }).fetchAll({
            require: false,
            withRelated: [{
                'tehsil': function (query) {
                    query.select('id', 'tehsil_name', 'district_id');
                }
            }]
        });

        const pinData = await Promise.all(pinList.map(async (pin) => {
            const tehsil = pin.related('tehsil');
            const district = await District.where({ id: tehsil.get('district_id') }).fetch({ require: false });

            let stateName = null;
            let countryName = null;
            if (district) {
                const state = await State.where({ id: district.get('state_id') }).fetch({ require: false });
                const country = await Country.where({ id: district.get('country_id') }).fetch({ require: false });

                stateName = state ? state.get('state_name') : null;
                countryName = country ? country.get('country_name') : null;
            }

            return {
                id: pin.get('id'),
                pin_code: pin.get('pin_code'),
                active_status: pin.get('active_status'),
                tehsil_name: tehsil.get('tehsil_name'),
                district_name: district ? district.get('district_name') : null,
                state_name: stateName,
                country_name: countryName

            };
        }));

        return res.success({
            pin: pinData,
            count: pinData.length
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
