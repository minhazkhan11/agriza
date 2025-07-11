'use strict';
const bcrypt = require('bcrypt');
const { ErrorHandler } = require('../../../../../lib/utils');
const Warehouseinformation = require('../../../../../models/be_warehouse_information');
const { constants } = require('../../../../../config');
const User = require('../../../../../models/users')

module.exports = async (req, res, next) => {
  try {
    const warehouse_information = await Warehouseinformation.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ id: req.params.id })
    }).fetch({
      require: false,
      withRelated: [
        {
          'pincode_id': function (query) {
            query.select('id', 'pin_code');
          }
        },
        {
          'place_id': function (query) {
            query.select('id', 'place_name');
          }
        },
        {
          'gst_id': function (query) {
            query.select('id', 'gst_number');
          }
        },   {
          'be_information_id': function (query) {
            query.select('id', 'business_name');
          }
        }
      ],
      columns: ['id', 'name', 'address', 'gst_id','be_information_id', 'pincode_id', 'place_id', 'latitude', 'longitude', 'ship_info', 'active_status']
    });


    if (!warehouse_information)
      return res.serverError(400, 'warehouse information details');
    return res.success({ warehouse_information });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};