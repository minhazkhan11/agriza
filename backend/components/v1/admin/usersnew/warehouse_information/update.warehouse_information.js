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
      return res.serverError(400, ErrorHandler('Data not found'));


    const body = req.body.warehouse_information
    const data = await new Warehouseinformation().where({ id }).save(body, { method: 'update' });

    const newwarehouse_information = await Warehouseinformation.where({ id }).fetch({ require: false });

    return res.success({ warehouse_information: newwarehouse_information });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};