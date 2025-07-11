'use strict';
const bcrypt = require('bcrypt');
const { ErrorHandler } = require('../../../../../lib/utils');
const Warehouseinformation = require('../../../../../models/be_warehouse_information');
const { constants } = require('../../../../../config');
const User = require('../../../../../models/users')

module.exports = async (req, res) => {
  try {

    const warehouse_information = await Warehouseinformation.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active])
        .andWhere({ be_information_id: req.params.be_id })
        .orderBy('created_at', 'asc');
    }).fetchAll({
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
        },
        {
          'be_information_id': function (query) {
            query.select('id', 'business_name');
          }
        }
      ],
      columns: ['id', 'name', 'address', 'latitude', 'pincode_id', 'place_id', 'gst_id', 'be_information_id', 'longitude', 'ship_info', 'active_status']
    });

    if (!warehouse_information) {
      return res.serverError(404, ErrorHandler("warehouse_information not found"));
    }

    return res.success({ warehouse_information });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};