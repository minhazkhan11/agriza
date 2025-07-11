'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const State = require('../../../../../models/state');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        const state = await State.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .andWhere({ country_id: req.params.id })
                .orderBy('created_at', 'asc');
        }).fetchAll({ require: false ,
            columns: ['id', 'state_name']
        });

        if (!state)
            return res.serverError(400, 'invalid state ');
        return res.success({ states:state });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
