'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const District = require('../../../../../models/district');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    let stateIds = req.body.ids || [];

    if (!Array.isArray(stateIds) || stateIds.length === 0) {
      return res.serverError(400, 'Invalid or missing state IDs');
    }

    const district = await District.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .whereIn('state_id', stateIds)
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      columns: ['id', 'district_name']
    });

    if (!district || district.length === 0) {
      return res.serverError(400, 'No district found for given state IDs');
    }

    return res.success({ district });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
