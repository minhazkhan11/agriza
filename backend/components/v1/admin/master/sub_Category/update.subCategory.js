'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Category = require('../../../../../models/sub_business_category');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {

    const id = req.body.sub_category.id;
    let Check = await Category.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler('sub_category name not found'));

    const body = req.body.sub_category;
    const sub_category = await new Category().where({ id }).save(body, { method: 'update' });

    const newPlace = await Category.where({ id }).fetch({ require: false });

    return res.success({ sub_category: newPlace });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};