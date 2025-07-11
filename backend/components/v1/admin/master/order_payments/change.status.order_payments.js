'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Order_Payments = require('../../../../../models/order_payments');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.order_payments.id;
        let Check = await Order_Payments.where({ id }).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('Order_Payments not found'));

        const body = req.body.order_payments;
        const order_payments = await new Order_Payments().where({ id }).save(body, { method: 'update' });

        return res.success({ order_payments });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};