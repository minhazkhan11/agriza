'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Tehsil = require('../../../../../models/tehsil');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        const tehsil = await Tehsil.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .andWhere({ id: req.params.id })
                .orderBy('created_at', 'asc');
        }).fetch({
            require: false,
            withRelated: [{
                'district': function (query) {
                    query.select('id', 'district_name');
                }
            }]
        });

        if (!tehsil)
            return res.serverError(400, 'invalid tehsil');
        return res.success({ tehsil });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
