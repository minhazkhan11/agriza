'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Activity = require('../../../../../models/order_activity');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.order_activity.id;
        let Check = await Activity.where({ id }).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('Activity not found'));

        const body = req.body.order_activity;
        const order_activity = await new Activity().where({ id }).save(body, { method: 'update' });

        return res.success({ order_activity });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};