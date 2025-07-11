'use strict';
const bcrypt = require('bcrypt');
const { ErrorHandler } = require('../../../../../lib/utils');
const Warehouseinformation = require('../../../../../models/be_warehouse_information');
const { constants } = require('../../../../../config');
const User = require('../../../../../models/users')

module.exports = async (req, res, next) => {
  try {

    const id = req.body.warehouse_information.id;
    let Check = await Warehouseinformation.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler(' Warehouse information not found'));

    const body = req.body.warehouse_information;
    const warehouse_information = await new Warehouseinformation().where({ id }).save(body, { method: 'update' });


    return res.success({ warehouse_information });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};