'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Forms = require('../../../../../models/gooleForms');
const FormFields = require('../../../../../models/gooleFormFields');
const FormResponse = require('../../../../../models/gooleFormResponse');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
    try {
        // Fetch the form
        const form = await Forms.where({ id: req.params.id, added_by: req.user.id }).fetch({ require: false });
        if (!form)
            return res.serverError(400, ErrorHandler('Form not found'));

        // Fetch form fields
        const fields = await FormFields.where({
            form_id: form.get('id'),
            added_by: req.user.id,
            active_status: constants.activeStatus.active,
        }).fetchAll({ require: false, columns: ['id', 'form_id', 'label', 'type'] });

        // Initialize arrays
        let userArray = [];
        let fieldArray = [];

        // Process each form field
        for (const field of fields) {
            const responses = await FormResponse.where({ form_field_id: field.get('id') }).fetchAll({
                require: false,
                columns: ['id', 'form_field_id', 'response', 'name', 'mobile', 'email']
            });

            let responseArray = [];
            for (const response of responses) {
                const { name, mobile, email, ...rest } = response.toJSON();
                responseArray.push({ name, mobile, email, ...rest });
            }

            // Push unique responses to userArray
            userArray.push(...responseArray.filter(response => !userArray.find(user =>
                user.name === response.name && user.mobile === response.mobile && user.email === response.email
            )));

            // Add responses to field object
            fieldArray.push({
                ...field.toJSON(),
                response: responseArray
            });
        }

        // Create learnerArray
        let learnerArray = [];

        // Process each unique user
        for (const user of userArray) {
            // Clone fieldArray
            let newFieldArray = fieldArray.map(field => ({ ...field }));

            // Filter responses for current user
            newFieldArray.forEach(field => {
                field.response = field.response.filter(response =>
                    response.name === user.name && response.mobile === user.mobile && response.email === user.email
                );
            });

            // Add form data to learner object
            learnerArray.push({
                ...user,
                form: { ...form.toJSON(), fields: newFieldArray }
            });
        }

        return res.success({ response: learnerArray });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
