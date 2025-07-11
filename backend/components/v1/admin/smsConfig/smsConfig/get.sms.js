'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const SmsConfig = require('../../../../../models/marketings/sms_configs');
const { constants } = require('../../../../../config');


module.exports = async (req, res, next) => {
    try {
        const config = await SmsConfig.where({
            added_by: req.user.id,
            active_status: constants.activeStatus.active
        }).fetch({ require: false });

        if (!config)
            return res.serverError(400, ErrorHandler('sms config not found'));

        return res.success({
            sms: config
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};