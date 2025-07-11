'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Master_product = require('../../../../../models/master_product');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.master_product;

    const check = await Master_product
      .query((qb) => {
        qb.where(function () {
          this.where('product_name', body.product_name)
        })
          .whereIn('active_status', ['active', 'inactive']);
      })
      .fetch({ require: false });

    if (check) {
      return res.serverError(500, ErrorHandler("all ready master_product exist"));
    }

    body.added_by = req.user.id;
    if (body.gst_id === "") {
      body.gst_id = null;
    }

    if (req.user.role === 'superadmin') {
      body.active_status = constants.activeStatus.active;
    } else {
      body.active_status = constants.activeStatus.pending;
    }


    const master_product = await new Master_product(body).save();

    return res.success({ master_product });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};