'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const User = require('../../../../../models/users');
const { constants } = require('../../../../../config');


module.exports = async (req, res, next) => {
    try {
        const persons = await User.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .andWhere({ id: req.params.id })
                .orderBy('created_at', 'asc');
        }).fetch({ require: false });

        if (!persons)
            return res.serverError(400, 'invalid persons');
        return res.success({ persons });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
