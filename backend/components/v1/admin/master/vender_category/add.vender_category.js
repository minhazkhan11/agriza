'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Category = require('../../../../../models/Vender_category');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.vender_category;

    const check = await Category
      .query((qb) => {
        qb.where(function () {
          this.where('name', body.name)
        })
          .whereIn('active_status', ['active', 'inactive']);
      })
      .fetch({ require: false });

    if (check) {
      return res.serverError(500, ErrorHandler("all ready vender_category name"));
    }

    body.added_by = req.user.id;

    const vender_category = await new Category(body).save();

    return res.success({ vender_category });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};