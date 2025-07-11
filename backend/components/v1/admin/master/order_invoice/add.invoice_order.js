// 'use strict';

// const { ErrorHandler } = require('../../../../../lib/utils');
// const Invoice = require('../../../../../models/order_invoice');
// const { constants } = require('../../../../../config');

// module.exports = async (req, res) => {
//   try {
//     let body = req.body.order_invoice;

//     const check = await Invoice
//       .query((qb) => {
//         qb.where(function () {
//           this.where('order_invoice', body.order_invoice)
//         })
//           .whereIn('active_status', ['active', 'inactive']);
//       })
//       .fetch({ require: false });

//     if (check) {
//       return res.serverError(500, ErrorHandler("Already order_invoice exist"));
//     }

//     body.added_by = req.user.id;

//     const order_invoice = await new Invoice(body).save();

//     return res.success({ order_invoice });
//   } catch (error) {
//     return res.serverError(500, { error: ErrorHandler(error) });
//   }
// };