'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const State = require('../../../../../models/state');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.state.id;
        let Check = await State.where({ id}).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('State not found'));

        const body = req.body.state;
        const state = await new State().where({ id }).save(body, { method: 'update' });

        const newState = await State.where({ id }).fetch({ require: false });

        return res.success({ state : newState });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};