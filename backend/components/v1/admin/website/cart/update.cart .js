'use strict';
const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
const { constants } = require('../../../../../config');


const Cart = require('../../../../../models/cart');
const Product = require('../../../../../models/product');

const { getCheckoutData } = require('../function/checkout');

module.exports = async (req, res) => {
    try {
        const { cart } = req.body;
        const { id } = cart;
        let { quantity } = cart;

        // Validate quantity
        if (quantity < 1)
            return res.serverError(400, ErrorHandler(constants.cart.error.invalidQuantity));


        // Check if the cart with the given id already exists
        const existingCart = await Cart.where({
            id,
            added_by: req.user.id,
            active_status: constants.activeStatus.active
        }).fetch({ require: false });

        if (!existingCart) {
            return res.serverError(400, ErrorHandler('Invalid cart Id'));
        }

        const existingCartData = existingCart.toJSON();

        // Check if the associated product with the cart exists and is active
        const existingProductToCart = await Product.where({
            id: existingCartData.product_id,
            active_status: constants.activeStatus.active
        }).fetch({
            require: false
        });

        if (!existingProductToCart) {
            return res.serverError(400, ErrorHandler(constants.cart.error.invalidProductId));
        }

       
        const updatedCart = await existingCart.save({ quantity }, { method: 'update' });

        let cartData = updatedCart.toJSON();

        let newCart = {
            id: cartData.id,
            product_id: cartData.product_id,
            quantity: cartData.quantity
        }


        const newProduct = await Product.where({
            id: existingCartData.product_id,
            active_status: constants.activeStatus.active
        }).fetch({
            require: false,
            withRelated: ['product_image'],
        });

        let productData = newProduct.toJSON();
        productData.product_image = processAttachment(productData.product_image);
        // delete productData.product_image;

        newCart.total_mrp = cartData.quantity * productData.mrp;
        newCart.total_cost = cartData.quantity * productData.selling_cost;
        newCart.total_discount = newCart.total_mrp * (productData.discount_percent/100);
        // write by rishabh
        // newCart.sub_total_discount = cartData.quantity * productData.discount;       

        
        newCart.product = productData;

        const checkout = await getCheckoutData(req.user.id);

        console.log('checkout', checkout)
        newCart.total_discount = checkout.total_discount;

        // return res.success({ message: constants.cart.success.updateCartSuccess, cart: newCart, checkout  });

        return res.success({ message: constants.cart.success.updateCartSuccess, cart: checkout });
    } catch (error) {
        // status code to 422 Unprocessable Entity and a more specific error message
        if (error.message === 'Invalid product type')
            return res.serverError(422, ErrorHandler(constants.cart.error.invalidProductType));
        return res.serverError(500, ErrorHandler(error));
    }
};


