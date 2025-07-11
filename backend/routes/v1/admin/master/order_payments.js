const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/master/order_payments/add.order_payments');
const fetchoneComponent = require('../../../../components/v1/admin/master/order_payments/fetch.one')
const fetchAllComponent = require('../../../../components/v1/admin/master/order_payments/fetch')
const fetchAllcustomerComponent = require('../../../../components/v1/admin/master/order_payments/fetch.customer')
const fetchAllvenderComponent = require('../../../../components/v1/admin/master/order_payments/fetch.vendor')
const fetchBeIdComponent = require('../../../../components/v1/admin/master/order_payments/fetch.customer_be_id')
const updateComponent = require('../../../../components/v1/admin/master/order_payments/update.order_payments')
const deleteComponent = require('../../../../components/v1/admin/master/order_payments/delete.order_payments')
const statusChangeComponent = require('../../../../components/v1/admin/master/order_payments/change.status.order_payments')



router.post('/add', adminMiddleware.checkAccess(), addComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.get('/be_id/:id', adminMiddleware.checkAccess(), fetchBeIdComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.put('/update', adminMiddleware.checkAccess(), updateComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);

router.get('/customer/data', adminMiddleware.checkAccess(), fetchAllcustomerComponent);
router.get('/vendor/data', adminMiddleware.checkAccess(), fetchAllvenderComponent);

module.exports = router;