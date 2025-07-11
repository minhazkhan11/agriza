// 'use strict';

// const { ErrorHandler } = require('../../../../../lib/utils');
// const Invoice = require('../../../../../models/order_invoice');
// const { constants } = require('../../../../../config');


// module.exports = async (req, res, next) => {
//   try {
//     const order_invoice = await Invoice.query((qb) => {
//       qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
//         .orderBy('created_at', 'asc');
//     }).fetchAll({
//       require: false,
//     });

//     const count = order_invoice.length;

//     return res.success({
//       order_invoice, count
//     });

//   } catch (error) {
//     return res.serverError(500, ErrorHandler(error));
//   }
// };