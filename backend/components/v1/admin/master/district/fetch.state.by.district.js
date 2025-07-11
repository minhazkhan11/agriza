'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const District = require('../../../../../models/district');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const district = await District.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ state_id: req.params.id })
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      columns: ['id', 'district_name']
    });

    if (!district)
      return res.serverError(400, 'invalid state ');
    return res.success({ district: district });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
