'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Forms = require('../../../../../models/gooleForms');
const FormFields = require('../../../../../models/gooleFormFields');
const FormFieldOptions = require('../../../../../models/gooleFormFieldOptions');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    const body = req.body.form;

    const formBody = {
      title: body.title,
      description: body.description,
      added_by: req.user.id,
    }

    const updatedForm = await new Forms().where({ id: body.id }).save(formBody, { method: 'update' });

    let formJson = updatedForm.toJSON();

    let fieldArray = [];
    if (body.fields.length > 0) {
      for (const field of body.fields) {
        const fieldBody = {
          form_id: body.id,
          label: field.label,
          type: field.type,
          required: field.required,
          added_by: req.user.id,
        }

        let formField;
        if (field.id) {
          formField = await new FormFields().where({ id: field.id }).save(fieldBody, { method: 'update' });
        } else {
          formField = await new FormFields(fieldBody).save();
        }

        let fieldJson = formField.toJSON();

        let optionArray = [];
        if (field.options && field.options.length > 0) {
          for (const option of field.options) {
            const optionBody = {
              form_field_id: fieldJson.id,
              option: option.option,
              added_by: req.user.id,
            }

            let fieldOption;
            if (option.id) {
              fieldOption = await new FormFieldOptions().where({ id: option.id }).save(optionBody, { method: 'update' });
              optionArray.push(fieldOption);
            } else {
              fieldOption = await new FormFieldOptions(optionBody).save();
              optionArray.push(fieldOption);
            }
          }
        }
        
        if (fieldJson.type === 'radio' || fieldJson.type === 'checkbox') {
          fieldJson.options = optionArray;
        }
        fieldArray.push(fieldJson);
      }
    }

    formJson.fields = fieldArray;

    return res.success({ form: formJson });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
