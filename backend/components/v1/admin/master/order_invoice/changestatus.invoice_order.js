// 'use strict';

// const { ErrorHandler } = require('../../../../../lib/utils');
// const Invoice = require('../../../../../models/order_invoice');
// const { constants } = require('../../../../../config');


// module.exports = async (req, res, next) => {
//   try {

//     const id = req.body.order_invoice.id;
//     let Check = await Invoice.where({ id }).fetch({ require: false });
//     if (!Check)
//       return res.serverError(400, ErrorHandler('invoice not found'));

//     const body = req.body.order_invoice;
//     const order_invoice = await new Invoice().where({ id }).save(body, { method: 'update' });

//     return res.success({ order_invoice });
//   } catch (error) {
//     return res.serverError(500, ErrorHandler(error));
//   }
// };