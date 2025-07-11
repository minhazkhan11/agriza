'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Forms = require('../../../../../models/gooleForms');
const FormFields = require('../../../../../models/gooleFormFields');
const FormFieldOptions = require('../../../../../models/gooleFormFieldOptions');
const { constants } = require('../../../../../config');
const { v4: uuidv4 } = require('uuid');

module.exports = async (req, res) => {
  try {
    const body = req.body.form;

    const formBody = {
      uid: uuidv4(),
      title: body.title,
      description: body.description,
      added_by: req.user.id,
    }

    const form = await new Forms(formBody).save();

    let formJson = form.toJSON();

    let fieldArray = [];
    if (body.fields.length > 0) {
      for (const field of body.fields) {
        const fieldBody = {
          form_id: formJson.id,
          label: field.label,
          type: field.type,
          required: field.required,
          added_by: req.user.id,
        }
        const savedField = await new FormFields(fieldBody).save();

        let optionArray = [];
        if (field.options && field.options.length > 0) {
          for (const option of field.options) {
            const optionBody = {
              form_field_id: savedField.id,
              option: option.option,
              added_by: req.user.id,
            }
            const savedOption = await new FormFieldOptions(optionBody).save();
            optionArray.push(savedOption);
          }
        }

        let fieldJson = savedField.toJSON();
        if (fieldJson.type === 'radio' || fieldJson.type === 'checkbox') {
          fieldJson.options = optionArray;
        }
        fieldArray.push(fieldJson);
      }
    }

    formJson.fields = fieldArray;
    // const link = `${process.env.BASE_URL}/v1/forms/${formJson.uid}`;
    // formJson.link = link;

    return res.success({ form: formJson });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
