const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const { upload, uploadCsv } = require("../../../../lib/utils/multer");


const addComponentcatalogue = require('../../../../components/v1/admin/be_information/product/product_catalogue');
const assignedfetchAllComponent = require('../../../../components/v1/admin/be_information/product/assigned.product');
const fetchAllComponent = require('../../../../components/v1/admin/be_information/product/fetchall.product_catalogue');
const deleteComponent = require('../../../../components/v1/admin/be_information/product/delete.product_catalogue');
// const fetchoneComponent = require('../../../../components/v1/admin/master/brand/fetch.one.brand');
// const updateComponent = require('../../../../components/v1/admin/master/brand/update.brand');
// const statusChangeComponent = require('../../../../components/v1/admin/master/brand/changestatus.brand');


router.post('/addcatalogue', adminMiddleware.be_adminAccess(), addComponentcatalogue);
// router.post('/add', adminMiddleware.be_adminAccess(), upload.array('files', 12), addComponent);
router.get('/', adminMiddleware.be_adminAccess(), fetchAllComponent);
router.get('/assigned_product', adminMiddleware.be_adminAccess(), assignedfetchAllComponent);
router.delete('/:id', adminMiddleware.be_adminAccess(), deleteComponent);
// router.put('/update', adminMiddleware.adminAccess(), updateComponent);
// router.put('/status', adminMiddleware.adminAccess(), statusChangeComponent);


module.exports = router;