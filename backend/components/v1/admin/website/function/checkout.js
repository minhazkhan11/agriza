'use strict';
const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
const { constants } = require('../../../../../config');
const Cart = require('../../../../../models/cart');
const Product = require('../../../../../models/product');

module.exports.getCheckoutData = async (userId) => {
    try {
        // Fetch all cart items
        const existingCart = await Cart.where({
            added_by: userId,
            active_status: constants.activeStatus.active
        })
            .orderBy('created_at', 'asc')
            .fetchAll({
                require: false,
                columns: ['id', 'product_id', 'quantity']
            });

        if (!existingCart || existingCart.length === 0) {
            throw new Error('No items found');
        }

        // Count
        const count = existingCart.length;

        let cartArray = [];
        let sub_total_mrp = 0;
        let sub_total_cost = 0;
        let sub_total_discount = 0;
        let orginal_mrp = 0;
        let delivery_cost = 0;

        for (const existingProduct of existingCart) {
            const cartData = existingProduct.toJSON();

           
            // Fetch product details
            const product = await Product.where({ id: cartData.product_id })
                .fetch({
                    require: false,
                    withRelated: ['product_image']
                });

            if (!product) {
                throw new Error('Product details not found');
            }

            let productInfo = product.toJSON();

            // // delivery cost
            // if (cartData.product_type === 'books') {
            //     const deliveryCostData = {
            //         sellerId: productInfo.added_by,
            //         learnerId: userId,
            //         itemWeight: parseInt(productInfo.item_weight),
            //         itemQuantity: parseInt(cartData.quantity),
            //     }

            //     const resultDeliveyCost = await deliveryCostFetch(deliveryCostData);
            //     delivery_cost += resultDeliveyCost ? resultDeliveyCost : 0;
            // }

            productInfo.purchase_cost = productInfo.purchase_cost ? productInfo.purchase_cost : 0;
            productInfo.mrp = productInfo.mrp ? productInfo.mrp : 0;
            productInfo.discount_percent = productInfo.discount_percent ? productInfo.discount_percent : 0;
            productInfo.selling_cost = productInfo.selling_cost ? productInfo.selling_cost : 0;

            productInfo.discount_cost = productInfo.mrp * (productInfo.discount_percent / 100)
            productInfo.selling_cost = productInfo.mrp - productInfo.discount_cost;

            cartData.quantity = cartData.quantity;
            cartData.mrp = productInfo.mrp.toFixed(2);
            cartData.discount = productInfo.discount_cost;
            // cartData.cost = productInfo.cost;

            // Calculate total cost and total discount for the item
            cartData.total_mrp = (productInfo.mrp * cartData.quantity).toFixed(2);
            orginal_mrp += parseFloat(cartData.total_mrp);
            cartData.total_cost = (productInfo.selling_cost * cartData.quantity).toFixed(2);
            cartData.total_discount = (productInfo.discount_cost * cartData.quantity).toFixed(2);

            console.log('cartData.total_cost', cartData.total_cost)
            console.log('cartData.total_discount', cartData.total_discount)

            cartData.product_name = productInfo.product_name;
            cartData.sub_heading = productInfo.sub_heading ? productInfo.sub_heading : '';

            cartData.product_image = processAttachment(productInfo.product_image);
            // delete productInfo.product_image;

            // sub_total_mrp += parseFloat(cartData.total_mrp);
            sub_total_mrp += ((productInfo.mrp * cartData.quantity).toFixed(2)) / 1.18;
            sub_total_cost += parseFloat(cartData.total_cost);

            sub_total_discount += parseFloat(cartData.total_discount);

            cartData.seller_id = productInfo.added_by;
            cartArray.push(cartData);
        }

        // Checkout details
        const shipping_cost = 0;
        // const delivery_cost = 0;
        const wallet_amount = 0;
        const cashback_amount = 0;



        const totalMrp = sub_total_mrp;
        const totalCost = sub_total_cost;
        const totalDiscount = sub_total_discount;
        const totalCost1 = sub_total_mrp - sub_total_discount;
        const extraCharges = shipping_cost + delivery_cost;
        const lessAmount = wallet_amount + cashback_amount;
        const subTotalcost = (totalCost1 + extraCharges) - lessAmount;


        //   const gst = totalCost * 0.18;
        const gst = orginal_mrp - sub_total_mrp;
        const grand_total_cost = subTotalcost + gst;

        let data = {
            products: cartArray,

            product_count: count,
            total_mrp: totalMrp.toFixed(2),
            total_cost: totalCost.toFixed(2),
            total_discount: totalDiscount.toFixed(2),

            shipping_cost: shipping_cost.toFixed(2),
            delivery_cost: delivery_cost.toFixed(2),
            wallet_amount: wallet_amount.toFixed(2),
            cashback_amount: cashback_amount.toFixed(2),

            sub_total_cost: subTotalcost.toFixed(2),
            gst: gst === 0.00 ? 0 : gst.toFixed(2),

            grand_total_cost: grand_total_cost.toFixed(2),

        };

        return data;

    } catch (error) {
        throw new Error(`Error getting checkout data: ${error.message}`);
    }
};
