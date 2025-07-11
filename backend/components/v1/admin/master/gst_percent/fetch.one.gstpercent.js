'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Gst = require('../../../../../models/gst_percent');
const { constants } = require('../../../../../config');


module.exports = async (req, res, next) => {
  try {
    const gst_percent = await Gst.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ id: req.params.id })
        .orderBy('created_at', 'asc');
    }).fetch({
      require: false,
    });

    if (!gst_percent)
      return res.serverError(400, 'invalid gst_percent ');
    return res.success({ gst_percent });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
