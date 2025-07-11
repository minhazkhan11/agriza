'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Brand = require('../../../../../models/brand');
const { constants } = require('../../../../../config');
const Attachments = require('../../../../../models/attachments');


module.exports = async (req, res, next) => {
  try {

    const id = req.body.brand.id;
    let Check = await Brand.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler('Brand not found'));

    const body = req.body.brand;
    const brand = await new Brand().where({ id }).save(body, { method: 'update' });

    const newBrand = await Brand.where({ id }).fetch({ require: false });

    return res.success({ brand: newBrand });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};