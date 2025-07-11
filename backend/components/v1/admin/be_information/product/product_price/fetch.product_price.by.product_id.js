'use strict';
const { ErrorHandler } = require('../../../../../../lib/utils');
const Productprice = require('../../../../../../models/product_price');
const { constants } = require('../../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const product_price = await Productprice.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ Product_id: req.params.id })
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      // columns: ['id', 'tehsil_name']
    });

    if (!product_price)
      return res.serverError(400, 'invalid product_price ');
    return res.success({ product_price: product_price });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
