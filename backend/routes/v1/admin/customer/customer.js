const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');



// const addComponent = require('../../../../components/v1/admin/be_information/product/product_price/add.product_price');

const fetchAllComponent = require('../../../../components/v1/admin/customer/addcustomer/fetchall.customer');



// router.post('/add', adminMiddleware.be_adminAccess(), addComponent);
router.get('/', adminMiddleware.be_adminAccess(), fetchAllComponent);



module.exports = router;