'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Order_Payments = require('../../../../../models/order_payments');
const Attachment = require('../../../../../models/attachments');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.order_payments;
    const orderImagePath = body.payments_image;
    delete body.payments_image;

    const check = await Order_Payments
      .query((qb) => {
        qb.where('transaction_id', body.transaction_id)
          .whereIn('active_status', ['active', 'inactive']);
      })
      .fetch({ require: false });

    if (check) {
      return res.serverError(500, ErrorHandler("Order payment already exists"));
    }

    body.added_by = req.user.id;


    const order_payments = await new Order_Payments(body).save();

    if (orderImagePath) {
      await new Attachment({
        entity_id: order_payments.id,
        entity_type: 'payments_image',
        photo_path: orderImagePath,
        added_by: req.user.id,
      }).save();
    }

    return res.success({ order_payments });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
