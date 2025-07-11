'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Place = require('../../../../../models/place');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const place = await Place.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ pin_id: req.params.id })
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      columns: ['id', 'place_name']
    });

    if (!place)
      return res.serverError(400, 'invalid state ');
    return res.success({ place: place });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};