'use strict';
const Constitution = require('../../../../../models/constitution')
const { ErrorHandler } = require('../../../../../lib/utils');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const constitutions = await Constitution.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      columns: ['id', 'name'],
    });

    const count = constitutions.length;

    return res.success({
      constitutions, count
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};