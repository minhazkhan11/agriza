'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const MailConfig = require('../../../../../models/mailConfig');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
    try {
        let body = req.body.config;
        body.added_by = req.user.id;

        const existingConfig = await MailConfig.where({
            added_by: req.user.id,
            active_status: constants.activeStatus.active,
        }).fetch({ require: false });

        if (existingConfig) {
            const udatedConfig = await new MailConfig().where({ id: existingConfig.id }).save(body, { method: 'update' });

            return res.success({ config: udatedConfig });
        }

        const savedConfig = await new MailConfig(body).save();

        return res.success({ config: savedConfig });
    } catch (error) {
        return res.serverError(500, { error: ErrorHandler(error) });
    }
};