'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const TemplateWhatsapp = require('../../../../../models/templateWhatsapp');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const whatsappId = req.body.template.id;
        let Check = await TemplateWhatsapp.where({ id: whatsappId }).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('TemplateWhatsapp not found'));

        const body = req.body.template;
        const template = await new TemplateWhatsapp().where({ id: whatsappId }).save(body, {method: 'update'}); 

        const status = template.get('active_status') === 'active' ? 'activated' : 'inactivated';
        
        return res.success({ message: `TemplateWhatsapp ${template.get('name')} has been successfully ${status}.` });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};