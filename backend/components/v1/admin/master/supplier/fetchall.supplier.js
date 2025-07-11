'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Suppliers = require('../../../../../models/suppliers');
const { constants } = require('../../../../../config');



module.exports = async (req, res, next) => {
  try {
    const supplier = await Suppliers.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,

    });

    const count = supplier.length;

    return res.success({
      supplier, count
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};