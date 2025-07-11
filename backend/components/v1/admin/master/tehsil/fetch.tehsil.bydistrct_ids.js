'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Tehsil = require('../../../../../models/tehsil');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    let districtIds = req.body.ids || [];

    if (!Array.isArray(districtIds) || districtIds.length === 0) {
      return res.serverError(400, 'Invalid or missing district IDs');
    }

    const tehsil = await Tehsil.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .whereIn('district_id', districtIds)
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      columns: ['id', 'tehsil_name']
    });

    if (!tehsil || tehsil.length === 0) {
      return res.serverError(400, 'No tehsil found for given district IDs');
    }

    return res.success({ tehsil });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
