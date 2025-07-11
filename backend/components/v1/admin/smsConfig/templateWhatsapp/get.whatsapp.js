'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const TemplateWhatsapp = require('../../../../../models/templateWhatsapp');
const { constants } = require('../../../../../config');


module.exports = async (req, res, next) => {
    try {
        const config = await TemplateWhatsapp.where(function () {
            this.whereIn('active_status', ['active', 'inactive'])
                .andWhere({ added_by: req.user.id });
        }).orderBy('created_at', 'desc')
            .fetchAll({ require: false });

        return res.success({
            template: config
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};