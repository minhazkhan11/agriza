const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/master/product_Class/add.ProductClass');
const fetchoneComponent = require('../../../../components/v1/admin/master/product_Class/fetch.one.Productclass')
const fetchAllComponent = require('../../../../components/v1/admin/master/product_Class/fetch.Productclass')
const updateComponent = require('../../../../components/v1/admin/master/product_Class/update.Productclass')
const deleteComponent = require('../../../../components/v1/admin/master/product_Class/delete.Productclass')
const statusChangeComponent = require('../../../../components/v1/admin/master/product_Class/changestatus.ProductClass')



router.post('/add', adminMiddleware.checkAccess(), addComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.put('/update', adminMiddleware.checkAccess(), updateComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);


module.exports = router;