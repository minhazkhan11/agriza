'use strict';

const { ErrorHandler, saveHtmlAndImage } = require('../../../../../lib/utils');
const TemplateWhatsapp = require('../../../../../models/templateWhatsapp');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.template;

    body.added_by = req.user.id;

    const templateWhatsapp = new TemplateWhatsapp(body);
    const savedTemplate = await templateWhatsapp.save();

    const result = await saveHtmlAndImage(body.template); 

    savedTemplate.template = result.html;
    await savedTemplate.save();

    // Returning the saved template in the response
    return res.success({ template: savedTemplate });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
