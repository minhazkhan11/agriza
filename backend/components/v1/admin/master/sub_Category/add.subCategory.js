'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Category = require('../../../../../models/sub_business_category');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.sub_category;

    const check = await Category
      .query((qb) => {
        qb.where(function () {
          this.where('sub_category_name', body.sub_category_name)
        })
          .whereIn('active_status', ['active', 'inactive']);
      })
      .fetch({ require: false });

    if (check) {
      return res.serverError(500, ErrorHandler("Already sub_category name"));
    }

    body.added_by = req.user.id;

    const sub_category = await new Category(body).save();

    return res.success({ sub_category });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};