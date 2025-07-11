const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/master/sub_Category/add.subCategory');
const deleteComponent = require('../../../../components/v1/admin/master/sub_Category/delete.subCategory');
const fetchAllComponent = require('../../../../components/v1/admin/master/sub_Category/fetchall.subCategory');
const fetchAllByCategoryIDComponent = require('../../../../components/v1/admin/master/sub_Category/fetch.subCategoryBYcategory_id');
const fetchoneComponent = require('../../../../components/v1/admin/master/sub_Category/fetch.one.subCategory');
const updateComponent = require('../../../../components/v1/admin/master/sub_Category/update.subCategory');
const statusChangeComponent = require('../../../../components/v1/admin/master/sub_Category/changestatus.subCategory');


router.post('/add', adminMiddleware.checkAccess(), addComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.post('/business_category_id', adminMiddleware.checkAccess(), fetchAllByCategoryIDComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.put('/update', adminMiddleware.checkAccess(), updateComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);


module.exports = router;