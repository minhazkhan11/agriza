'use strict';
const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
const { constants } = require('../../../../../config');
const Product = require('../../../../../models/product');
const Wishlist = require('../../../../../models/whishlist');



module.exports = async (req, res, next) => {
    try {
        const wishlist = await Wishlist.where({
            added_by: req.user.id,
            active_status: constants.activeStatus.active
        }).fetchAll({
            require: false,
            columns: ['id', 'product_id']
        });

        const count = wishlist.length;

        let wishlistArray = [];
        for (const product of wishlist) {

            let wishlistData = product.toJSON();

            const existingProduct = await Product.where({ id: wishlistData.product_id }).fetch({
                require: false,
                withRelated: ['product_image'],
               
            });

            let existingProductData = existingProduct.toJSON();

            existingProductData.product_image = processAttachment(existingProductData.product_image);

            // delete existingProductData.product_image;

            wishlistData.product = existingProductData;

            wishlistArray.push(wishlistData);
        }

        return res.success({
            wishlist: wishlistArray,
            count
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};