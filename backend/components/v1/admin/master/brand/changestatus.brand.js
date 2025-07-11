'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Brand = require('../../../../../models/brand');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {

    const id = req.body.brand.id;
    let Check = await Brand.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler('brand not found'));

    const body = req.body.brand;
    const brand = await new Brand().where({ id }).save(body, { method: 'update' });

    return res.success({ brand });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};