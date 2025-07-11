'use strict';
const { ErrorHandler, processAttachment,  } = require('../../../../../lib/utils');
const { constants } = require('../../../../../config');
const Product = require('../../../../../models/product');
const Wishlist = require('../../../../../models/whishlist');


module.exports = async (req, res) => {
  try {
    let body = req.body.wishlist;
    const { product_id } = body;

    // Check if the product with the given id already exists
    const existingProduct = await Product.where({
      id: product_id,
      active_status: constants.activeStatus.active
    }).fetch({ require: false });

    if (!existingProduct) {
      return res.serverError(422, ErrorHandler(constants.wishlist.error.invalidProductId));
    }

    // existing wishlist product
    const existingProductToWishlist = await Wishlist.where({
      product_id: product_id,
      added_by: req.user.id,
      active_status: constants.activeStatus.active
    }).fetch({ require: false });

    if (existingProductToWishlist)
      return res.serverError(200, ErrorHandler(constants.wishlist.success.alreadyExistsInWishlist));

    // Update the body with additional information if needed
    body.added_by = req.user.id;

    // Save the product using the chosen model 
    const wishlist = await new Wishlist(body).save();

    // 
    const newCart = await Wishlist.where({ id: wishlist.id }).fetch({ require: false });

    let wishlistData = newCart.toJSON();

    const newProduct = await Product.where({
      id: wishlistData.product_id,
      active_status: constants.activeStatus.active
    }).fetch({
      require: false,
      withRelated: ['product_image']
    });

    let productData = newProduct.toJSON();
    productData.image_url = processAttachment(productData.product_image);
    delete productData.product_image;

    wishlistData.product = productData;

    return res.success({ message: constants.wishlist.success.addToWishlistSuccess, wishlist: wishlistData });
  } catch (error) {
    // status code to 422 Unprocessable Entity and a more specific error message
    if (error.message === 'Invalid product type')
      return res.serverError(422, ErrorHandler(constants.wishlist.error.invalidProductType));
    return res.serverError(500, ErrorHandler(error));
  }
};
