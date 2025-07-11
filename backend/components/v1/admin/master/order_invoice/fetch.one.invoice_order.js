// 'use strict';

// const { ErrorHandler } = require('../../../../../lib/utils');
// const Invoice = require('../../../../../models/order_invoice');
// const { constants } = require('../../../../../config');


// module.exports = async (req, res, next) => {
//   try {
//     const order_invoice = await Invoice.query((qb) => {
//       qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
//         .andWhere({ id: req.params.id })
//         .orderBy('created_at', 'asc');
//     }).fetch({
//       require: false,
//     });

//     if (!order_invoice)
//       return res.serverError(400, 'invalid invoice ');
//     return res.success({ order_invoice });

//   } catch (error) {
//     return res.serverError(500, ErrorHandler(error));
//   }
// };
