
const staffRouter = require('../admin/staff/staff');
const childcategoryRouter = require('./website/child_category/child_cat');
const homeRouter = require('./website/home/home');
const wishlistRouter = require('./website/whishlist/wishlist');
const cartRouter  = require('./website/cart/cart');

module.exports = {
  staffRouter,
  childcategoryRouter,
  homeRouter,
  wishlistRouter,
  cartRouter
};
