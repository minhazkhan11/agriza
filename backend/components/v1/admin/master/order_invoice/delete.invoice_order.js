// 'use strict';

// const { ErrorHandler } = require('../../../../../lib/utils');
// const Invoice = require('../../../../../models/order_invoice');
// const { constants } = require('../../../../../config');

// module.exports = async (req, res, next) => {
//   try {
//     //Get logged in user
//     let check = await Invoice.where({ id: req.params.id }).fetch({ require: false });
//     if (!check)
//       return res.serverError(400, ErrorHandler(new Error('Invoice not found')));
//     await new Invoice().where({ id: req.params.id }).save({ active_status: constants.activeStatus.deleted }, { method: 'update' })
//       .then(() => {
//         return res.success({ 'message': 'Invoice deleted successfully' });
//       })
//       .catch(err => {
//         return res.serverError(400, ErrorHandler('Something went wrong'));
//       })
//   } catch (error) {
//     console.log('errorrr', error);
//     return res.serverError(500, ErrorHandler(error));
//   }
// };
