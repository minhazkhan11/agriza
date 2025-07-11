'use strict';
const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
const { constants } = require('../../../../../config');
const Product = require('../../../../../models/product');

const Cart = require('../../../../../models/cart');

module.exports = async (req, res, next) => {
    try {
        const cart = await Cart.where({
            added_by: req.user.id,
            active_status: constants.activeStatus.active
        })
            .orderBy('created_at', 'asc')
            .fetchAll({
                require: false,
                columns: ['id', 'product_id', 'quantity']
            });



        // Check if the cart is empty
        if (!cart || cart.length === 0) {
            // If the cart is empty, return checkout data with all prices set to 0
            return res.success({
                products: [],
                product_count: 0,
                checkout: {
                    sub_total_cost: 0,
                    sub_total_discount: 0,
                    shipping_cost: 0,
                    delivery_cost: 0,
                    wallet_amount: 0,
                    cashback_amount: 0,
                    gst: 0,
                    grand_total_cost: 0,
                }
            });
        }

        let cartArray = [];
        let orginal_mrp= 0;
        let sub_total_mrp = 0;
        let sub_total_cost = 0;
        let sub_total_discount = 0;
        let delivery_cost = 0;

        for (const product of cart) {
            if (!product) {
                // Handle the case where product is null
                continue; // or other error handling
            }
            let cartData = product.toJSON();


            const existingProduct = await Product.where({
                id: cartData.product_id,
                active_status: constants.activeStatus.active
            }).fetch({
                require: false,
                withRelated: ['product_image']
            });

            if (!existingProduct) {
                // Handle the case where existingProduct is null
                continue; // or other error handling
            }
            let productData = existingProduct.toJSON();


            productData.purchase_cost = productData.purchase_cost ? productData.purchase_cost : 0;
            productData.mrp = productData.mrp ? productData.mrp : 0;
            productData.discount_percent = productData.discount_percent ? productData.discount_percent : 0;
            productData.selling_cost = productData.selling_cost ? productData.selling_cost : 0;

            productData.discount_cost = productData.mrp * (productData.discount_percent / 100)
            productData.selling_cost = productData.mrp - productData.discount_cost;

            productData.product_image = processAttachment(productData.product_image);
            // delete productData.product_image;

            cartData.total_mrp = (productData.mrp * cartData.quantity).toFixed(2);
            cartData.total_cost = (productData.selling_cost * cartData.quantity).toFixed(2);
            cartData.total_discount = (productData.discount_cost * cartData.quantity).toFixed(2);
            cartData.product = productData;

            cartArray.push(cartData);
            orginal_mrp += parseFloat(cartData.total_mrp) ;
            sub_total_mrp += ((productData.mrp * cartData.quantity).toFixed(2))/1.18;
            sub_total_cost += parseFloat(cartData.total_cost);
            sub_total_discount += parseFloat(cartData.total_discount);
        }

        // shiping cost
        let shipping_cost = 0;
        // if (cartArray.length > 0) {
        //     shipping_cost = 30;
        // }

        // total        
        // const delivery_cost = 0;
        const wallet_amount = 0;
        const cashback_amount = 0;

        const totalMrp = sub_total_mrp;
        const totalCost = sub_total_cost;
        const totalCost1 = sub_total_mrp-sub_total_discount;
        const totalDiscount = sub_total_discount;
        const extraCharges = shipping_cost + delivery_cost;
        const lessAmount = wallet_amount + cashback_amount;
        const subTotalcost = (totalCost1 + extraCharges) - lessAmount;

        const gst =  orginal_mrp-sub_total_mrp;
        console.log(orginal_mrp, 'original')
        const grand_total_cost = subTotalcost + gst;

        // checkout details
        const checkout = {};
        checkout.products = cartArray;
        checkout.product_count = cartArray.length;
        checkout.total_mrp = totalMrp == 0.00 ? 0 : totalMrp.toFixed(2);
        checkout.total_cost = totalCost == 0.00 ? 0 : totalCost.toFixed(2);
        checkout.total_discount = totalDiscount == 0.00 ? 0 : totalDiscount.toFixed(2);
        checkout.shipping_cost = shipping_cost == 0.00 ? 0 : shipping_cost.toFixed(2);
        checkout.delivery_cost = delivery_cost == 0.00 ? 0 : delivery_cost.toFixed(2);
        checkout.wallet_amount = wallet_amount == 0.00 ? 0 : wallet_amount.toFixed(2);
        checkout.cashback_amount = cashback_amount == 0.00 ? 0 : cashback_amount.toFixed(2);

        checkout.sub_total_cost = subTotalcost == 0.00 ? 0 : subTotalcost.toFixed(2);
        checkout.gst = gst == 0.00 ? 0 : gst.toFixed(2);

        checkout.grand_total_cost = grand_total_cost == 0.00 ? 0 : grand_total_cost.toFixed(2);

        return res.success({
            cart: checkout
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};


