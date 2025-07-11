'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Lead_Category = require('../../../../../models/lead_category');
const Uqc = require('../../../../../models/uqc');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        if (!req.params.id) {
            return res.serverError(400, 'Missing lead_category ID');
        }

        // Fetch lead_category by ID
        const lead_category = await Lead_Category.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .andWhere({ id: req.params.id })
                .orderBy('created_at', 'asc');
        }).fetch({ require: false });

        if (!lead_category) {
            return res.serverError(400, 'Invalid lead_category');
        }

        return res.success({ lead_category: lead_category });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};


