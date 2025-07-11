const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');
const { file, upload, uploadFileMemory } = require("../../../../lib/utils/multer");





const addComponent = require('../../../../components/v1/admin/master/Product_sub_Category/add.product_sub_category');
const fetchoneComponent = require('../../../../components/v1/admin/master/Product_sub_Category/fetch.one.product_sub_category')
const fetchAllComponent = require('../../../../components/v1/admin/master/Product_sub_Category/fetchall.product_sub_category')
const fetchAllByProductCategoryComponent = require('../../../../components/v1/admin/master/Product_sub_Category/fetch.product_sub_CategoryBYproduct_category_id')
const updateComponent = require('../../../../components/v1/admin/master/Product_sub_Category/update.product_sub_category')
const deleteComponent = require('../../../../components/v1/admin/master/Product_sub_Category/delete.product_sub_category')
const statusChangeComponent = require('../../../../components/v1/admin/master/Product_sub_Category/changestatus.product_sub_category')

const fetchallByidsComponent = require('../../../../components/v1/admin/master/Product_sub_Category/fetch.productsubcategory_by_productscategory_ids')

const cpUpload = uploadFileMemory.fields([
  { name: "sub_category_image", maxCount: 1 },
])

router.post('/add', adminMiddleware.checkAccess(), cpUpload, addComponent);


router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.put('/update', adminMiddleware.checkAccess(), cpUpload, updateComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);
router.get('/product_category_id/:id', adminMiddleware.checkAccess(), fetchAllByProductCategoryComponent);
router.post('/category_id', fetchallByidsComponent);


module.exports = router;