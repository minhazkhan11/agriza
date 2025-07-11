'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Rake = require('../../../../../models/rake');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        const rake = await Rake.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
            .andWhere({ added_by: req.user.id })
                .orderBy('created_at', 'asc');
        }).fetchAll({ require: false, withRelated: [
            {
              'warehouse_id': function (query) {
                query.select('id', 'name');
              }
            }],
        
        });

        const count = rake.length;

        return res.success({
            rake, count
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};