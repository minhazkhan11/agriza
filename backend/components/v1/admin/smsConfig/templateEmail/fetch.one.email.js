'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const TemplateEmail = require('../../../../../models/templateEmail');
const constants = require('../../../../../config/constants');

module.exports = async (req, res, next) => {
    try {
        const email = await TemplateEmail.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .andWhere({ id: req.params.id })
                .orderBy('created_at', 'asc');
        }).fetch({ require: false });

        if (!email)
            return res.serverError(400, 'invalid email template');
        return res.success({template: email });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
