'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');

const { constants } = require('../../../../../config');
const Order_Payments = require('../../../../../models/order_payments');
module.exports = async (req, res, next) => {
    try {
        //Get logged in user
        let check = await Order_Payments.where({ id: req.params.id }).fetch({ require: false });
        if (!check)
            return res.serverError(400, ErrorHandler(new Error(' Order_Payments not found')));
        await new Order_Payments().where({ id: req.params.id }).save({ active_status: constants.activeStatus.deleted }, { method: 'update' })
            .then(() => {
                return res.success({ 'message': ' Order_Payments deleted successfully' });
            })
            .catch(err => {
                return res.serverError(400, ErrorHandler('Something went wrong'));
            })
    } catch (error) {
        console.log('errorrr', error);
        return res.serverError(500, ErrorHandler(error));
    }
};
