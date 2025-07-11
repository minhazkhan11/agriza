'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const SmsConfig = require('../../../../../models/marketings/sms_configs');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
    try {
        let body = req.body.config;
        body.added_by = req.user.id;

        const existingConfig = await SmsConfig.where({
            added_by: req.user.id,
            active_status: constants.activeStatus.active,
        }).fetch({ require: false });

        if (existingConfig) {
            const udatedConfig = await new SmsConfig().where({ id: existingConfig.id }).save(body, { method: 'update' });

            return res.success({ config: udatedConfig });
        }

        const savedConfig = await new SmsConfig(body).save();

        return res.success({ config: savedConfig });
    } catch (error) {
        return res.serverError(500, { error: ErrorHandler(error) });
    }
};