'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Rakepoint = require('../../../../../models/rakepoint');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
    try {
      
        const rakepoints = await Rakepoint.query(qb => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
            .andWhere({ id: req.params.id })
            .orderBy('created_at', 'asc');
        }).fetch({
            withRelated: [
                {
                  'place_id': function (query) {
                    query.select('id', 'place_name');
                  }
                }]
        });

        if (!rakepoints)
            return res.serverError(400, 'invalid rakepoints');
      

        return res.success({
            rakepoints
        });

    } catch (error) {
        return res.serverError(500, { error: ErrorHandler(error) });
    }
};
