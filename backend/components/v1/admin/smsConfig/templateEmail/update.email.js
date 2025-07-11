'use strict';
const { ErrorHandler ,saveHtmlAndImage } = require('../../../../../lib/utils');
const { constants } = require('../../../../../config');
const TemplateEmail = require('../../../../../models/templateEmail');


module.exports = async (req, res, next) => {
    try {
        const id = req.body.template.id;

        if (!id)
            return res.serverError(400, ErrorHandler('ID is required'));

        let existingTemplate = await TemplateEmail.where({ id }).fetch({ require: false });
        if (!existingTemplate)
            return res.serverError(400, ErrorHandler('TemplateEmail not found'));

        const body = req.body.template;
        const updatedTemplate = await existingTemplate.save(body, { method: 'update' });

        const result = await saveHtmlAndImage(body.template);

        updatedTemplate.set('template', result.html); 
        await updatedTemplate.save();

        return res.success({ template: updatedTemplate });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
