'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Pin = require('../../../../../models/pin');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {

    let tehsilIds = req.body.ids || [];

    if (!Array.isArray(tehsilIds) || tehsilIds.length === 0) {
      return res.serverError(400, 'Invalid or missing tehsil IDs');
    }

    const pin = await Pin.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .whereIn('tehsil_id', tehsilIds)
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      columns: ['id', 'pin_code']
    });

    if (!pin || pin.length === 0) {
      return res.serverError(400, 'No pin codes found for given tehsil IDs');
    }

    return res.success({ pin });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
