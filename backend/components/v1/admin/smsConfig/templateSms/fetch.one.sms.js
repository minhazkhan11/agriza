'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const TemplateSms = require('../../../../../models/templateSms');
const constants = require('../../../../../config/constants');

module.exports = async (req, res, next) => {
    try {
        const sms = await TemplateSms.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .andWhere({ id: req.params.id })
                .orderBy('created_at', 'asc');
        }).fetch({ require: false });

        if (!sms)
            return res.serverError(400, 'invalid sms template');
        return res.success({template: sms });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
