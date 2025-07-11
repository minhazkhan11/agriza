'use strict';

const { ErrorHandler } = require('../../../../../../lib/utils');
const Productprice = require('../../../../../../models/product_price');
const { constants } = require('../../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const product_price = await Productprice.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .orderBy('created_at', 'asc');
    }).fetchAll({ require: false });

    const count = product_price.length;

    return res.success({
      product_price, count
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};