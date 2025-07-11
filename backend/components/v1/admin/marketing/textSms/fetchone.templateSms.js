'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const TemplateSms = require('../../../../../models/templateSms');
const { constants } = require('../../../../../config');


module.exports = async (req, res, next) => {
    try {
        const sms = await TemplateSms.where(function () {
            this.whereIn('active_status', ['active', 'inactive'])
                .andWhere({ template_id: req.params.id });
        }).orderBy('created_at', 'desc')
            .fetch({ require: false });

        return res.success({
            textsms: sms
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};