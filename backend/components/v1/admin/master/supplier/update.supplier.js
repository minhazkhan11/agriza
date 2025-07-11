'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Suppliers = require('../../../../../models/suppliers');
const { constants } = require('../../../../../config');


module.exports = async (req, res, next) => {
  try {

    const id = req.body.supplier.id;
    let Check = await Suppliers.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler('supplier_name not found'));

    const body = req.body.supplier;
    const supplier = await new Suppliers().where({ id }).save(body, { method: 'update' });

    const newsupplier = await Suppliers.where({ id }).fetch({ require: false });

    return res.success({ supplier: newsupplier });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};