'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const User = require('../../../../../models/users');
const bcrypt = require('bcrypt');
const constants = require('../../../../../config/constants');

//updating password with user access
module.exports = async (req, res, next) => {
    try {

        let body = req.body;
        //To get password we need to fetch from db 

        if (body.current_password === body.password || body.current_password === body.password_confirmation) {
            const errorMessage = "Current password cannot be the same as the new password.";
            return res.serverError(400, ErrorHandler(new Error(errorMessage)));
        }
        
        console.log(req.user.id,"idd")

        let currentPassword = await User.where({ id: req.user.id }).fetch({ columns: ['id', 'password'] });
        currentPassword = currentPassword.attributes.password;

        if (bcrypt.compareSync(body.current_password, currentPassword)) {

            if (body.password === body.password_confirmation) {
                //compare with recent Password.

                if (bcrypt.compareSync(body.password, currentPassword)) {
                    return res.serverError(400, ErrorHandler(new Error(constants.error.auth.passwordUsedRecently)));
                }

                await new User().where({ id: req.user.id }).save({ password: body.password }, { method: 'update' })
                    .then(() => {
                        return res.success({ message: 'Password changed successfully' });
                       
                    }).catch(err => {
                        // TODO://handle this error properly 'ErrorCtor [CustomError]: EmptyResponse'
                        console.log(req.user.id)
                        return res.success({ message: 'Password changed successfully' });
                    });
            } else {
                return res.serverError(400, ErrorHandler(new Error(constants.error.auth.passwordNotMatch)));
            }
        } else {
            return res.serverError(400, ErrorHandler(new Error(constants.error.auth.passwordWrong)));
        }
    } catch (error) {
        console.log('errorrr', error);
        // Customize the error message for "EmptyResponse"
        if (error.message === 'EmptyResponse')
            return res.status(422).json({ error: 'Invalid user or user not found' });
        return res.serverError(500, ErrorHandler(error));
    }
};