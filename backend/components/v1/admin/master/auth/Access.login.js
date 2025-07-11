'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const passport = require('passport');
const passportMiddleWare = require('../../../../../middlewares/passport.middleware');
const User = require('../../../../../models/users');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        const userId = req.params.id;
        
        if (!userId) {
            return res.status(400).json({ error: 'user id not found' });
        }

        // fetch user
        const user = await User.where({ id: userId, active_status: constants.activeStatus.active}).fetch({ require: false });

        console.log(user)

        if (!user)
            return res.serverError(402, ErrorHandler(new Error(constants.error.auth.invalidUser)));

        // Generate access tokens
        const tokenData = await passportMiddleWare.generateSignUpToken(user.toJSON());
        console.log(tokenData)

        const response = {
            message: 'be_admin login success',
            user: tokenData.user,
            token: tokenData.token,
            refresh_token: tokenData.refresh_token,
        };
        // Send the response with the message and token
        return res.success(response);

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};