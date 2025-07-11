'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Suppliers = require('../../../../../models/suppliers');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.supplier;

    const check = await Suppliers
      .query((qb) => {
        qb.where(function () {
          this.where('supplier_name', body.supplier_name)
        })
          .whereIn('active_status', ['active', 'inactive']);
      })
      .fetch({ require: false });

    if (check) {
      return res.serverError(500, ErrorHandler("Already state_name "));
    }

    body.added_by = req.user.id;

    const supplier = await new Suppliers(body).save();

    return res.success({ supplier });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};