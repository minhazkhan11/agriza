'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const TemplateWhatsapp = require('../../../../../models/templateWhatsapp');
const constants = require('../../../../../config/constants');

module.exports = async (req, res, next) => {
    try {
        const whatsapp = await TemplateWhatsapp.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .andWhere({ id: req.params.id })
                .orderBy('created_at', 'asc');
        }).fetch({ require: false });

        if (!whatsapp)
            return res.serverError(400, 'invalid whatsapp template');
        return res.success({template: whatsapp });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
