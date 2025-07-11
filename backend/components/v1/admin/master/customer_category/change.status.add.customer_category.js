'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Category = require('../../../../../models/customer_category');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {

    const id = req.body.customer_category.id;
    let Check = await Category.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler('customer_category not found'));

    const body = req.body.customer_category;
    const customer_category = await new Category().where({ id }).save(body, { method: 'update' });

    return res.success({ customer_category });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};