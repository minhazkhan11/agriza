const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/master/customer_category/add.customer_category');
const fetchoneComponent = require('../../../../components/v1/admin/master/customer_category/fetch.one.add.customer_category')
const fetchAllComponent = require('../../../../components/v1/admin/master/customer_category/fetch.all.add.customer_category')
const updateComponent = require('../../../../components/v1/admin/master/customer_category/update.customer_category')
const deleteComponent = require('../../../../components/v1/admin/master/customer_category/delete.add.customer_category')
const statusChangeComponent = require('../../../../components/v1/admin/master/customer_category/change.status.add.customer_category')



router.post('/add', adminMiddleware.checkAccess(), addComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.put('/update', adminMiddleware.checkAccess(), updateComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);

module.exports = router;