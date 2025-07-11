'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const State = require('../../../../../models/state');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    let countryIds = req.body.ids || [];

    if (!Array.isArray(countryIds) || countryIds.length === 0) {
      return res.serverError(400, 'Invalid or missing country IDs');
    }

    const state = await State.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .whereIn('country_id', countryIds)
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      columns: ['id', 'state_name']
    });

    if (!state || state.length === 0) {
      return res.serverError(400, 'No state found for given country IDs');
    }

    return res.success({ state });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
