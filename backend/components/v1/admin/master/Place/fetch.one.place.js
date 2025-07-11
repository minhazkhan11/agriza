'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Place = require('../../../../../models/place');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        const place = await Place.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .andWhere({ id: req.params.id })
                .orderBy('created_at', 'asc');
        }).fetch({ require: false ,
            withRelated: [{
                'pin': function (query) {
                    query.select('id', 'pin_code');
                }
            }]
        });

        if (!place)
            return res.serverError(400, 'invalid place name');
        return res.success({ place });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
