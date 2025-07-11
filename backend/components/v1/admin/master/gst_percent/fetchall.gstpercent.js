'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Gst = require('../../../../../models/gst_percent');
const { constants } = require('../../../../../config');


module.exports = async (req, res, next) => {
  try {
    const gst_percent = await Gst.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
    });

    const count = gst_percent.length;

    return res.success({
      gst_percent, count
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};