'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Pin = require('../../../../../models/pin');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const pin = await Pin.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ tehsil_id: req.params.id })
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      columns: ['id', 'pin_code']
    });

    if (!pin)
      return res.serverError(400, 'invalid state ');
    return res.success({ pin: pin });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
