'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Place = require('../../../../../models/place');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {

    let pinIds = req.body.ids || [];

    if (!Array.isArray(pinIds) || pinIds.length === 0) {
      return res.serverError(400, 'Invalid or missing pin IDs');
    }

    const place = await Place.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .whereIn('pin_id', pinIds)
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      columns: ['id', 'place_name']
    });

    if (!place || place.length === 0) {
      return res.serverError(400, 'No place found for given pin IDs');
    }

    return res.success({ place });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
