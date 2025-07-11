'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Units = require('../../../../../models/units');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.units;

    const check = await Units
      .query((qb) => {
        qb.where(function () {
          this.where('unit_name', body.unit_name)
        })
          .whereIn('active_status', ['active', 'inactive']);
      })
      .fetch({ require: false });

    if (check) {
      return res.serverError(500, ErrorHandler("all ready unit name"));
    }
    //
    body.added_by = req.user.id;

    const units = await new Units(body).save();

    return res.success({ units });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};