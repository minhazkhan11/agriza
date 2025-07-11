'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Category = require('../../../../../models/sub_business_category');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {

    let categoryIds = req.body.sub_category.business_category_ids;

    if (!Array.isArray(categoryIds) || categoryIds.length === 0) {
      return res.serverError(400, 'Invalid or missing business_category_ids array.');
    }


    const sub_categories = await Category.query((qb) => {
      qb.whereIn('business_category_id', categoryIds)
        .whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      columns: ['id', 'business_category_id', 'sub_category_name']
    });

    if (!sub_categories || sub_categories.length === 0) {
      return res.serverError(400, 'No sub-categories found for given business_category_ids.');
    }

    return res.success({ sub_categories });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
