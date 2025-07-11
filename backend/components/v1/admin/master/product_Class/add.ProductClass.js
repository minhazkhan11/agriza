'use strict';
const ProductClass = require('../../../../../models/product_class')
const { ErrorHandler } = require('../../../../../lib/utils');



module.exports = async (req, res) => {
  try {
    let body = req.body.productclass;

    const check = await ProductClass
      .query((qb) => {
        qb.where(function () {
          this.where('class_name', body.class_name)
        })
          .whereIn('active_status', ['active', 'inactive']);
      })
      .fetch({ require: false });

    if (check) {
      return res.serverError(500, ErrorHandler("Already class_name exist"));
    }

    body.added_by = req.user.id;

    const productclass = await new ProductClass(body).save();

    return res.success({ productclass });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};