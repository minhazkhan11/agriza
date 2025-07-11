'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const State = require('../../../../../models/state');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        const state = await State.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .orderBy('created_at', 'asc');
        }).fetchAll({ require: false ,
            withRelated: [{
                    'country': function (query) {
                        query.select('id', 'country_name');
                    }
                }]
         });

        const count = state.length;

        return res.success({
            state, count
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};