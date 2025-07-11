'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Gst = require('../../../../../models/gst_percent');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.gst_percent;

    const check = await Gst
      .query((qb) => {
        qb.where(function () {
          this.where('gst_percent', body.gst_percent)
        })
          .whereIn('active_status', ['active', 'inactive']);
      })
      .fetch({ require: false });

    if (check) {
      return res.serverError(500, ErrorHandler("Already gst_percent exist"));
    }

    body.added_by = req.user.id;

    const gst_percent = await new Gst(body).save();

    return res.success({ gst_percent });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};