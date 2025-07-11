'use strict';
const { ErrorHandler, awsUtil } = require('../../../../../lib/utils');
const constants = require('../../../../../config/constants');
const Cart = require('../../../../../models/cart');

module.exports = async (req, res, next) => {
    try {
        let check = await Cart.where({ id: req.params.id }).fetch({ require: false });
        if (!check)
            return res.serverError(400, ErrorHandler(new Error('Product not found')));   

        await new Cart().where({ id: req.params.id }).save({ active_status: constants.activeStatus.deleted }, { method: 'update'})
        .then(() => {
            return res.success({'message': 'Product successfully deleted to the cart'});
        })
        .catch(err => {
            return res.serverError(400, ErrorHandler('Something went wrong'));
        })
    } catch (error) {
        console.log('error',error);
        return res.serverError(500, ErrorHandler(error));
    }
};
