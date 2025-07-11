'use strict';

const { ErrorHandler} = require('../../../../../lib/utils');
const Category = require('../../../../../models/business_category');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.category;    

    const check = await Category
    .query((qb) => {
      qb.where(function () {
        this.where('category_name', body.category_name)
      })
        .whereIn('active_status', ['active', 'inactive']);
    })
    .fetch({ require: false });

  if (check) {
    return res.serverError(500, ErrorHandler("all ready category name"));
  }

    body.added_by = req.user.id;
   
    const category = await new Category(body).save();

    return res.success({ category });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};