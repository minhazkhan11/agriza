'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const FormFieldOptions = require('../../../../../models/gooleFormFieldOptions');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
    try {
        let check = await FormFieldOptions.where({ id: req.params.id, added_by: req.user.id }).fetch({ require: false });
        if (!check)
            return res.serverError(400, ErrorHandler(new Error('Option not found')));

        await new FormFieldOptions().where({ id: req.params.id }).save({ active_status: constants.activeStatus.deleted }, { method: 'update' })
            .then(() => {
                return res.success({ 'message': 'Option deleted successfully' });
            })
            .catch(err => {
                return res.success({ 'message': 'Something went wrong' });
            })
    } catch (error) {
        console.log('error', error);
        return res.serverError(500, ErrorHandler(error));
    }
};
