
'use strict';
const ProductChildCategory = require('../../../../../models/Product_child_category');
const { ErrorHandler } = require('../../../../../lib/utils');


module.exports = async (req, res, next) => {
  try {

    const id = req.body.product_child_category.id;
    let Check = await ProductChildCategory.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler(' product child category not found'));

    const body = req.body.product_child_category;
    const product_child_category = await new ProductChildCategory().where({ id }).save(body, { method: 'update' });

    return res.success({ product_child_category });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};