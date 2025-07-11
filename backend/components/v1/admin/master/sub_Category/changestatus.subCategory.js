
'use strict';
const Category = require('../../../../../models/sub_business_category')
const { ErrorHandler } = require('../../../../../lib/utils');


module.exports = async (req, res, next) => {
  try {

    const id = req.body.sub_category.id;
    let Check = await Category.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler(' Product sub_category name not found'));

    const body = req.body.sub_category;
    const sub_category = await new Category().where({ id }).save(body, { method: 'update' });

    return res.success({ sub_category });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};