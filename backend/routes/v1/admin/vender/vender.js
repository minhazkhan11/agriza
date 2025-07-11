const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');



// const addComponent = require('../../../../components/v1/admin/be_information/product/product_price/add.product_price');

const fetchAllComponent = require('../../../../components/v1/admin/vender/addvender/fetchall.vender');



// router.post('/add', adminMiddleware.checkAccess(), addComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);



module.exports = router;