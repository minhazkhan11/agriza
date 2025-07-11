'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Master_product = require('../../../../../models/master_product');
const { constants } = require('../../../../../config');


module.exports = async (req, res, next) => {
  try {
    const master_product = await Master_product.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.pending, constants.activeStatus.active, constants.activeStatus.inactive, constants.activeStatus.cancelled])
        .whereNot('added_by', 1)
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      withRelated: [
        {
          'product_child_category_id': function (query) {
            query.select('id', 'product_child_category_name');
          }
        },
        {
          'gst_id': function (query) {
            query.select('id', 'gst_percent', 'gst_name');
          }
        },]
    });

    const count = master_product.length;

    return res.success({
      master_product, count
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};