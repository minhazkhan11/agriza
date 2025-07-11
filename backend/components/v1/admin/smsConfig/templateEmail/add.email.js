'use strict';

const { ErrorHandler, saveHtmlAndImage } = require('../../../../../lib/utils');
const TemplateEmail = require('../../../../../models/templateEmail');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.template;

    body.added_by = req.user.id;

    const templateEmail = new TemplateEmail(body);
    const savedTemplate = await templateEmail.save();

    const result = await saveHtmlAndImage(body.template); 

    savedTemplate.template = result.html;
    await savedTemplate.save();

    // Returning the saved template in the response
    return res.success({ template: savedTemplate });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
