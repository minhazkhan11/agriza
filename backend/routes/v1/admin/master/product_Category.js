const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/master/Product_Category/add.productCategory');
const fetchoneComponent = require('../../../../components/v1/admin/master/Product_Category/fetch.oneProductCategory')
const fetchAllComponent = require('../../../../components/v1/admin/master/Product_Category/fetchall.ProductCategory')
const fetchByclassIdAllComponent = require('../../../../components/v1/admin/master/Product_Category/fetch.productCategoryBYclass_id')
const updateComponent = require('../../../../components/v1/admin/master/Product_Category/update.ProductCategory')
const deleteComponent = require('../../../../components/v1/admin/master/Product_Category/delete.ProductCategory')
const statusChangeComponent = require('../../../../components/v1/admin/master/Product_Category/changestatus.ProductCat')



router.post('/add', adminMiddleware.checkAccess(), addComponent);

router.get('/class_id/:id', adminMiddleware.checkAccess(), fetchByclassIdAllComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.put('/update', adminMiddleware.checkAccess(), updateComponent);
router.put('/status', adminMiddleware.checkAccess(), joiMiddleware.joiBodyMiddleware(joiSchemas.changeStatus, 'productCategory'), statusChangeComponent);


module.exports = router;