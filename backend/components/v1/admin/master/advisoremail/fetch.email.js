'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const AdvisorEmail = require('../../../../../models/advisoremail');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        const email = await AdvisorEmail.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
            // .andWhere({ added_by: req.user.id })
                .orderBy('created_at', 'asc');
        }).fetchAll({ require: false,
        
        });

        const count = email.length;

        return res.success({
            email, count
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};