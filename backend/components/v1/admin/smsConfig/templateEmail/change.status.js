'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const TemplateEmail = require('../../../../../models/templateEmail');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const emailId = req.body.template.id;
        let Check = await TemplateEmail.where({ id: emailId }).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('template email not found'));

        const body = req.body.template;
        const template = await new TemplateEmail().where({ id: emailId }).save(body, {method: 'update'}); 

        const status = template.get('active_status') === 'active' ? 'activated' : 'inactivated';
        
        return res.success({ message: `TemplateEmail ${template.get('name')} has been successfully ${status}.` });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};