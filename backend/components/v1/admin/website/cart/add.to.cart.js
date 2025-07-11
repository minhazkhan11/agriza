'use strict';
const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
const { constants } = require('../../../../../config');
const Product = require('../../../../../models/product');

// Import all models
const Wishlist = require('../../../../../models/whishlist');
const Cart = require('../../../../../models/cart');

module.exports = async (req, res) => {
  try {
    let body = req.body.cart;

    const { product_id, quantity } = body;


    if (!product_id || !quantity) {
      return res.serverError(400, ErrorHandler('Required fields: product_id, product_type, quantity'));
    }

    if(quantity == 0 || quantity < 0){
      return res.serverError(400, ErrorHandler('Quantity must be minimun 1'));
    }

  
    // new fetch
    async function findNewData(cartId) {

      const newCart = await Cart.where({ id: cartId }).fetch({ require: false });

      let cartData = newCart.toJSON();

      const newProduct = await Product.where({
        id: cartData.product_id,
        active_status: constants.activeStatus.active
      }).fetch({
        require: false,
        withRelated: ['product_image']
      });

      let productData = newProduct.toJSON();
      productData.product_image = processAttachment(productData.product_image);
      // delete productData.product_image;

      cartData.product = productData;

      return cartData;
    }
    // // 

    // Check if the product with the given id already exists
    const existingProduct = await Product.where({
      id: product_id,
      active_status: constants.activeStatus.active
    }).fetch({ require: false });
    if (!existingProduct) {
      return res.serverError(422, ErrorHandler(constants.cart.error.invalidProductId));
    }

    // existing wishlist product
    const existingProductToWishlist = await Wishlist.where({
      product_id: product_id,
      added_by: req.user.id,
      active_status: constants.activeStatus.active
    }).fetch({ require: false });

    if (existingProductToWishlist) {
      await new Wishlist().where({ id: existingProductToWishlist.id }).save({ active_status: 'deleted' }, { method: 'update' })
    }

    // Update the body with additional information if needed
    body.added_by = req.user.id;

    const existingProductToCart = await Cart.where({
      product_id: product_id,
      added_by: req.user.id,
      active_status: constants.activeStatus.active
    }).fetch({ require: false });

    if (existingProductToCart) {

      return res.serverError(400, ErrorHandler('Product already exists in your cart'));
     
      // update
      const updatedCart = await new Cart().where({ id: existingProductToCart.id }).save({ quantity }, { method: 'update' })

      const cart1 = await findNewData(updatedCart.get('id'));

      return res.success({ message: constants.cart.success.addToCartSuccess, cart: cart1 });
    }

    // Save the product using the chosen model 
    const cart = await new Cart(body).save();

    const cart2 = await findNewData(cart.get('id'));

    return res.success({ message: constants.cart.success.addToCartSuccess, cart: cart2 });
  } catch (error) {
    // status code to 422 Unprocessable Entity and a more specific error message
    if (error.message === 'Invalid product type')
      return res.serverError(422, ErrorHandler(constants.cart.error.invalidProductType));
    return res.serverError(500, ErrorHandler(error));
  }
};
