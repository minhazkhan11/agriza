'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Pin = require('../../../../../models/pin');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        const pin = await Pin.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .andWhere({ id: req.params.id })
                .orderBy('created_at', 'asc');
        }).fetch({ require: false ,
            withRelated: [{
                'tehsil': function (query) {
                    query.select('id', 'tehsil_name');
                }
            }]
        });

        if (!pin)
            return res.serverError(400, 'invalid pin code');
        return res.success({ pin });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
