'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Suppliers = require('../../../../../models/suppliers');
const { constants } = require('../../../../../config');



module.exports = async (req, res, next) => {
  try {
    const supplier = await Suppliers.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ id: req.params.id })
        .orderBy('created_at', 'asc');
    }).fetch({
      require: false,

    });

    if (!supplier)
      return res.serverError(400, 'invalid supplier_name');
    return res.success({ supplier });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
