'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const AdvisorPhone = require('../../../../../models/advisorphone');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        const phone = await AdvisorPhone.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
            // .andWhere({ added_by: req.user.id })
                .orderBy('created_at', 'asc');
        }).fetchAll({ require: false,      
        });

        const count = phone.length;

        return res.success({
            phone, count
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};