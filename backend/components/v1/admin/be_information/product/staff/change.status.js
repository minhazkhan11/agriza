'use strict';
const { ErrorHandler, sendGrid } = require('../../../../../../lib/utils');
const User = require('../../../../../../models/users');
const { constants } = require('../../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.user.id;
        let Check = await User.where({ id, role: 'user' }).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('user not found'));

        const body = req.body.user;
        const user = await new User().where({ id }).save(body, {method: 'update'}); 
        
        return res.success({ user });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};