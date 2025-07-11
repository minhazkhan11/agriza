'use strict';
const { ErrorHandler } = require('../../../../../../lib/utils');
const User = require('../../../../../../models/users');
const constants = require('../../../../../../config/constants');
module.exports = async (req, res, next) => {
    try {
        let user = await User.where({ id: req.params.id, role: 'user' }).fetch({ require: false });
        if (!user)
            return res.serverError(400, ErrorHandler(new Error(constants.error.auth.userNotFound)));
        await new User().where({ id: req.params.id, role: 'user' }).save({ active_status: constants.activeStatus.deleted }, { method: 'update' })
            .then(() => {
                return res.success({ 'message': 'user deleted successfully' });
            })
            .catch(err => {
                return res.success({ 'message': 'Something went wrong' });
            })
    } catch (error) {
        console.log('error', error);
        return res.serverError(500, ErrorHandler(error));
    }
};
