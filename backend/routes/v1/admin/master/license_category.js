const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/master/license_category/add.license_category');
const fetchoneComponent = require('../../../../components/v1/admin/master/license_category/fetch.one.license_category')
const fetchAllComponent = require('../../../../components/v1/admin/master/license_category/fetch.license_category')
const updateComponent = require('../../../../components/v1/admin/master/license_category/update.license_category')
const deleteComponent = require('../../../../components/v1/admin/master/license_category/delete.license_category')
const statusChangeComponent = require('../../../../components/v1/admin/master/license_category/change.status.license_category')



router.post('/add', adminMiddleware.checkAccess(), addComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.put('/update', adminMiddleware.checkAccess(), updateComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);


module.exports = router;