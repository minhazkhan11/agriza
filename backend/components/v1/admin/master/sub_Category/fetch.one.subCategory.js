'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Category = require('../../../../../models/sub_business_category');
const { constants } = require('../../../../../config');



module.exports = async (req, res, next) => {
  try {
    const sub_category = await Category.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ id: req.params.id })
        .orderBy('created_at', 'asc');
    }).fetch({
      require: false,

    });

    if (!sub_category)
      return res.serverError(400, 'invalid sub_category name');
    return res.success({ sub_category });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};

