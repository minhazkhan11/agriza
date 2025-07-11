'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Pin = require('../../../../../models/pin');
const Tehsil = require('../../../../../models/tehsil');
const District = require('../../../../../models/district');
const State = require('../../../../../models/state');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        // Fetch pin details with related tehsil
        const pin = await Pin.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .andWhere({ id: req.params.id })
                .orderBy('created_at', 'asc');
        }).fetch({
            require: false,
            withRelated: [{
                'tehsil': (query) => {
                    query.select('id', 'tehsil_name');
                }
            }],
            columns: ['id', 'pin_code', 'tehsil_id']
        });

        if (!pin) return res.serverError(400, 'Invalid pin code');

        let pinJson = pin.toJSON();

        // Fetch tehsil details
        const tehsil = await Tehsil.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .andWhere({ id: pinJson.tehsil_id })
                .orderBy('created_at', 'asc');
        }).fetch({ require: false });

        if (!tehsil) return res.serverError(400, 'Invalid tehsil data');

        let tehsilJson = tehsil.toJSON();

        // Fetch district details
        const district = await District.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .andWhere({ id: tehsilJson.district_id })
                .orderBy('created_at', 'asc');
        }).fetch({
            require: false,
            columns: ['id', 'district_name', 'state_id']
        });

        let districtJson = district ? district.toJSON() : null;
        console.log(districtJson, "hhafdhafdaydauydag");

        // Fetch State details using districtJson.state_id
        const state = await State.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .andWhere({ id: districtJson ? districtJson.state_id : null }) 
                .orderBy('created_at', 'asc');
        }).fetch({
            require: false,
            columns: ['id', 'state_name']
        });

        let stateJson = state ? state.toJSON() : null;

        pinJson.district = districtJson;
        pinJson.state = stateJson;

        return res.success({ pin: pinJson });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
