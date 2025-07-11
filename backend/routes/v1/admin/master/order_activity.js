const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/master/order_activity/add.order_activity');
const fetchoneComponent = require('../../../../components/v1/admin/master/order_activity/fetch.one')
const fetchAllComponent = require('../../../../components/v1/admin/master/order_activity/fetch')
const fetchAllcustomerComponent = require('../../../../components/v1/admin/master/order_activity/fetch.customer')
const fetchAllvenderComponent = require('../../../../components/v1/admin/master/order_activity/fetch.vendor')
const updateComponent = require('../../../../components/v1/admin/master/order_activity/update')
const deleteComponent = require('../../../../components/v1/admin/master/order_activity/delete')
const statusChangeComponent = require('../../../../components/v1/admin/master/order_activity/change.order_activity')
const fetchBeIdComponent = require('../../../../components/v1/admin/master/order_activity/fetch.customer_be_id')


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