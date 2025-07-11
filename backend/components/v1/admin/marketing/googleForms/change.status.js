'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Forms = require('../../../../../models/gooleForms');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
    try {
        const id = req.body.form.id;

        const existingForm = await Forms.where({ id, added_by: req.user.id }).fetch({ require: false });
        if (!existingForm)
            return res.serverError(400, ErrorHandler('Form not found'));

        // Update the status
        const body = { active_status: req.body.form.active_status };

        const updatedForm = await new Forms().where({ id }).save(body, { method: 'update' });

        // Determine the active status and set the message accordingly
        let message = updatedForm.get('active_status') === 'active' ? 'Form activated successfully.' : 'Form inactivated successfully.';
        return res.success({ message });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
