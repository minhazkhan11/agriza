const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/master/supplier/add.supplier');
const deleteComponent = require('../../../../components/v1/admin/master/supplier/delete.supplier');
const fetchAllComponent = require('../../../../components/v1/admin/master/supplier/fetchall.supplier');
const fetchoneComponent = require('../../../../components/v1/admin/master/supplier/featch.one.supplier');
const updateComponent = require('../../../../components/v1/admin/master/supplier/update.supplier');
const statusChangeComponent = require('../../../../components/v1/admin/master/supplier/changestatuse.supplier');


router.post('/add', adminMiddleware.checkAccess(), addComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.put('/update', adminMiddleware.checkAccess(), updateComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);


module.exports = router;