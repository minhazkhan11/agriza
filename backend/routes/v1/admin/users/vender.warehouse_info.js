const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const warehouse_information = require('../../../../components/v1/admin/usersnew/warehouse_information/add.warehouse_information');
const deleteComponent = require('../../../../components/v1/admin/usersnew/warehouse_information/delete.warehouse_information');
const fetchAllComponent = require('../../../../components/v1/admin/usersnew/warehouse_information/fatchall.warehouse_information');
const fetchoneComponent = require('../../../../components/v1/admin/usersnew/warehouse_information/fetch.one.warehouse_information');
const updateComponent = require('../../../../components/v1/admin/usersnew/warehouse_information/update.warehouse_information');
const statusChangeComponent = require('../../../../components/v1/admin/usersnew/warehouse_information/changestatus.warehouse_information');
const fetchAllCBeIdomponent = require('../../../../components/v1/admin/usersnew/warehouse_information/fetch.be_info_id.warehouse_information');


router.post('/add',  adminMiddleware.checkAccess(),warehouse_information);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.get('/be_info_id/:be_id', adminMiddleware.checkAccess(), fetchAllCBeIdomponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.put('/update', adminMiddleware.checkAccess(), updateComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);


module.exports = router;