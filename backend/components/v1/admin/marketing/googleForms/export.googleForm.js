'use strict';

const fs = require('fs');
const path = require('path');
const { ErrorHandler } = require('../../../../../lib/utils');
const Forms = require('../../../../../models/gooleForms');
const FormFields = require('../../../../../models/gooleFormFields');
const FormResponse = require('../../../../../models/gooleFormResponse');
const { stringify } = require('csv-stringify/sync');
const { convert } = require('html-to-text');
const { constants } = require('../../../../../config');
const moment = require('moment');

function formatDate(milliseconds) {
    return moment(milliseconds).format('DD-MM-YYYY');
}

module.exports = async (req, res, next) => {
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
        })
            .orderBy('created_at', 'asc')
            .fetchAll({ require: false, columns: ['id', 'form_id', 'label', 'type'] });

        // Initialize arrays
        let userArray = [];
        let fieldArray = [];

        // Process each form field
        for (const field of fields) {
            const responses = await FormResponse.where({ form_field_id: field.get('id') })
                .orderBy('created_at', 'asc')
                .fetchAll({
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

        let formArray = [];
        for (const l of learnerArray) {
            let formData = {};
            formData['learner name'] = l.name;
            formData['mobile'] = l.mobile;
            formData['email'] = l.email;
            formData['form name'] = convert(l.form.title);

            for (const f of l.form.fields) {

                console.log('dhcvdh', f.label);

                let resData = "";
                for (const r of f.response) {
                    if (resData !== "") {
                        resData += ", ";
                    }
                    resData += convert(r.response);
                }

                formData[convert(f.label)] = resData;
            }

            formArray.push(formData)
        }

        // Convert formArray to CSV
        const csvData = stringify(formArray, {
            header: true
        });

        const directoryPath = path.join(__dirname, '../../../../../public/uploads/exports');
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }

        const filePath = path.join(directoryPath, 'form.csv');
        fs.writeFileSync(filePath, csvData);
        res.setHeader('Content-Disposition', 'attachment; filename=form.csv');
        res.setHeader('Content-Type', 'text/csv');
        res.sendFile(filePath, (err) => {
            if (err) {
                next(err);
            } else {
                fs.unlinkSync(filePath);
            }
        });

        return res.success({
            message: 'Form exported successfully',
            file_url: `${process.env.BASE_URL}/${filePath.split('public')[1]}`
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
