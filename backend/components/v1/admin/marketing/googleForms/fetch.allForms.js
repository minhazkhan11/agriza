'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Forms = require('../../../../../models/gooleForms');
const FormFields = require('../../../../../models/gooleFormFields');
const FormFieldOptions = require('../../../../../models/gooleFormFieldOptions');
const InstituteInformations = require('../../../../../models/instituteInformations');
const FormResponse = require('../../../../../models/gooleFormResponse');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
    try {
        const instituteInfo = await InstituteInformations.where({ institute_id: req.user.id }).fetch({ require: false });

        const forms = await Forms.query((qb) => {
            qb.whereIn('active_status', ['active', 'inactive'])
                .andWhere({ added_by: req.user.id })
                .orderBy('created_at', 'desc');
        }).fetchAll({ require: false });

        let formArray = [];
        for (const form of forms) {
            let formJson = form.toJSON();
            formJson.institute_name = instituteInfo.toJSON().institute_name;
            const fields = await FormFields.where({
                form_id: formJson.id,
                added_by: req.user.id,
                active_status: constants.activeStatus.active,
            })
                .orderBy('created_at', 'asc')
                .fetchAll({ require: false });

            let fieldArray = [];
            let submissionArray = [];
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
                    fieldJson.options = options;
                }
                const responses = await FormResponse.where({ form_field_id: field.get('id') }).count();
                submissionArray.push(responses);
                fieldArray.push(fieldJson);
            }
            
            let maxNumber = submissionArray[0];
            for (let i = 1; i < submissionArray.length; i++) {
                if (submissionArray[i] > maxNumber) {
                    maxNumber = submissionArray[i];
                }
            }

            formJson.submission_count = maxNumber;

            formJson.fields = fieldArray;
            // const link = `${process.env.BASE_URL}/v1/forms/${formJson.uid}`;
            // formJson.link = link;
            formArray.push(formJson);
        }

        const count = formArray.length;

        return res.success({
            forms: formArray,
            count
        });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};