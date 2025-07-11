
'use strict';
const ProductClass = require('../../../../../models/product_class')
const { ErrorHandler } = require('../../../../../lib/utils');
const { constants } = require('../../../../../config');



module.exports = async (req, res, next) => {
  try {
    const productClass = await ProductClass.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ id: req.params.id })
        .orderBy('created_at', 'asc');
    }).fetch({ require: false });

    if (!productClass)
      return res.serverError(400, 'invalid productClass');
    return res.success({ productClass });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};

