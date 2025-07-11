const express = require('express');
const router = express.Router();

const joiMiddleware = require('../../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../../middlewares/admin.middleware');

const addtoCartComponent = require('../../../../../components/v1/admin/website/cart/add.to.cart');
const fetchAllCartComponent = require('../../../../../components/v1/admin/website/cart/fetchall.cart');
const removeToCartComponent = require('../../../../../components/v1/admin/website/cart/delete.cart');
const updateToCartComponent = require('../../../../../components/v1/admin/website/cart/update.cart ');

router.post('/add', addtoCartComponent);
router.get('/',  fetchAllCartComponent);
router.delete('/:id',  removeToCartComponent);
router.put('/update' , updateToCartComponent);
// router.get('/checkout/single',  checkoutSingleComponent);


module.exports = router;