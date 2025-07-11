'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Rake = require('../../../../../models/rake');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        const rake = await Rake.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .andWhere({ id: req.params.id })
                .orderBy('created_at', 'asc');
        }).fetch({  require: false, withRelated: [
            {
              'warehouse_id': function (query) {
                query.select('id', 'name');
              }
            }],
        
        });

        if (!rake)
            return res.serverError(400, 'invalid rake');
        return res.success({ rake });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
