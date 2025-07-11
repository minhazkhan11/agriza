'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Country = require('../../../../../models/country');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        const country = await Country.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .andWhere({ id: req.params.id })
                .orderBy('created_at', 'asc');
        }).fetch({ require: false });

        if (!country)
            return res.serverError(400, 'invalid country');
        return res.success({ country });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
