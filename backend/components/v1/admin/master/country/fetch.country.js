'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Country = require('../../../../../models/country');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        const country = await Country.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .orderBy('created_at', 'asc');
        }).fetchAll({ require: false });

        const count = country.length;

        return res.success({
            country, count
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};