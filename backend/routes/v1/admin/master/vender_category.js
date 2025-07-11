const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/master/vender_category/add.vender_category');
const fetchoneComponent = require('../../../../components/v1/admin/master/vender_category/fetch.one.add.vender_category')
const fetchAllComponent = require('../../../../components/v1/admin/master/vender_category/fetch.all.add.vender_category')
const updateComponent = require('../../../../components/v1/admin/master/vender_category/update.vender_category')
const deleteComponent = require('../../../../components/v1/admin/master/vender_category/delete.add.vender_category')
const statusChangeComponent = require('../../../../components/v1/admin/master/vender_category/change.status.add.vender_category')



router.post('/add', adminMiddleware.checkAccess(), addComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.put('/update', adminMiddleware.checkAccess(), updateComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);
module.exports = router;