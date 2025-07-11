'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Category = require('../../../../../models/sub_business_category');
const { constants } = require('../../../../../config');


module.exports = async (req, res, next) => {
  try {
    const sub_category = await Category.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false, withRelated: [{
        'business_category_id': function (query) {
          query.select('id', 'category_name');
        }
      }]
    });

    const count = sub_category.length;

    return res.success({
      sub_category, count
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};