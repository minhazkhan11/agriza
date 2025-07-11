const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');




const addComponent = require('../../../../components/v1/admin/master/product_child_category/add.product_child_category');

const fetchoneComponent = require('../../../../components/v1/admin/master/product_child_category/fetch.one.product_child_category')
const fetchAllComponent = require('../../../../components/v1/admin/master/product_child_category/fetchall.product_child_category')
// const fetchAllByProductCategoryComponent = require('../../../../components/v1/admin/master/Product_sub_Category/fetch.product_sub_CategoryBYproduct_category_id')
const updateComponent = require('../../../../components/v1/admin/master/product_child_category/update.product_child_category')
const deleteComponent = require('../../../../components/v1/admin/master/product_child_category/delete.product_child_category')
const statusChangeComponent = require('../../../../components/v1/admin/master/product_child_category/change.status.product_child_category')
const fetchallByidsComponent = require('../../../../components/v1/admin/master/product_child_category/fetch.productchildcategory_by_productsubcategory_ids')

const { file, upload, uploadFileMemory } = require("../../../../lib/utils/multer");

const cpUpload = uploadFileMemory.fields([
  { name: "child_category_image", maxCount: 1 },
])

router.post('/add', adminMiddleware.checkAccess(), cpUpload, addComponent);


router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.put('/update', adminMiddleware.checkAccess(), cpUpload, updateComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);
// router.get('/product_category_id/:id', adminMiddleware.be_adminAccess(), fetchAllByProductCategoryComponent);
router.post('/category_id', fetchallByidsComponent);

module.exports = router;


