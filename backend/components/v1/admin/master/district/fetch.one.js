'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const District = require('../../../../../models/district');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        const district = await District.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .andWhere({ id: req.params.id })
                .orderBy('created_at', 'asc');
        }).fetch({ require: false ,
            withRelated: [{
                'country': function (query) {
                    query.select('id', 'country_name');
                },
                'state': function (query) {
                    query.select('id', 'state_name');
                }
            }]
        });

        if (!district)
            return res.serverError(400, 'invalid district ');
        return res.success({ district });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
