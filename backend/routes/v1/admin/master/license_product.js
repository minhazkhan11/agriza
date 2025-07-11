const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/master/license_product/add.license_product');
const fetchoneComponent = require('../../../../components/v1/admin/master/license_product/fetch.one.license_product')
const fetchAllComponent = require('../../../../components/v1/admin/master/license_product/fetch.license_product')
const deleteComponent = require('../../../../components/v1/admin/master/license_product/delete.license_product')
const updateComponent = require('../../../../components/v1/admin/master/license_product/update.license_product')
const statusChangeComponent = require('../../../../components/v1/admin/master/license_product/change.status.license_product')
const fetchAllbylicensedeComponent = require('../../../../components/v1/admin/master/license_product/fetch.one.licensebylicensepro')


router.post('/add', adminMiddleware.checkAccess(), addComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.get('/license/:id', adminMiddleware.checkAccess(), fetchAllbylicensedeComponent);
router.put('/update', adminMiddleware.checkAccess(), updateComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);


module.exports = router;