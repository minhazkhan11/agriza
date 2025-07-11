'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Forms = require('../../../../../models/gooleForms');
const FormFields = require('../../../../../models/gooleFormFields');
const FormFieldOptions = require('../../../../../models/gooleFormFieldOptions');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
    try {
        const form = await Forms.query((qb) => {
            qb.whereIn('active_status', ['active', 'inactive'])
                .andWhere({ id: req.params.id })
                .andWhere({ added_by: req.user.id })
        }).fetch({ require: false });

        if (!form)
            return res.serverError(400, ErrorHandler('Form not found'));

        let formJson = form.toJSON();
        const fields = await FormFields.where({
            form_id: formJson.id,
            added_by: req.user.id,
            active_status: constants.activeStatus.active,
        })
        .orderBy('created_at', 'asc')
        .fetchAll({ require: false });

        let fieldArray = [];
        for (const field of fields) {
            let fieldJson = field.toJSON();

            if (fieldJson.type === 'radio' || fieldJson.type === 'checkbox') {
                const options = await FormFieldOptions.where({
                    form_field_id: fieldJson.id,
                    added_by: req.user.id,
                    active_status: constants.activeStatus.active,
                })
                .orderBy('created_at', 'asc')
                .fetchAll({ require: false });

                console.log('options', options)
                fieldJson.options = options;
            }
            fieldArray.push(fieldJson);
        }

        formJson.fields = fieldArray;
        // const link = `${process.env.BASE_URL}/v1/forms/${formJson.uid}`;
        // formJson.link = link;

        return res.success({ form: formJson });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};