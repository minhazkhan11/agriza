'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const TextSMS = require('../../../../../models/textSms');
const TextSMSuser = require('../../../../../models/textSmsUser');
const { constants } = require('../../../../../config');


module.exports = async (req, res, next) => {
    try {
        const sms = await TextSMSuser.where(function () {
            this.whereIn('active_status', ['active', 'inactive'])
                .andWhere({ text_sms_id : req.params.id });
        }).orderBy('created_at', 'desc')
            .fetchAll({ require: false });
       const count = sms.length;
        return res.success({
            textsms: sms ,count
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};