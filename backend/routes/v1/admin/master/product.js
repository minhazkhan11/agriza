const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');
const { upload, uploadCsv, uploadFileMemory, uploadImages } = require("../../../../lib/utils/multer");

const addComponent = require('../../../../components/v1/admin/master/product/add.product');
const deleteComponent = require('../../../../components/v1/admin/master/product/delete.product');
const fetchAllComponent = require('../../../../components/v1/admin/master/product/fetch.product');
const fetchoneComponent = require('../../../../components/v1/admin/master/product/fetch.one.product');
const updateComponent = require('../../../../components/v1/admin/master/product/update.product');
const statusChangeComponent = require('../../../../components/v1/admin/master/product/change.status');
const CsvexportDataComponent = require('../../../../components/v1/admin/master/product/export.product.csv');
const CsvimportDataComponent = require('../../../../components/v1/admin/master/product/import.product.csv');
const fetchAllpendingComponent = require('../../../../components/v1/admin/master/product/fetch.product.approval');
const fetchRemarkComponent = require('../../../../components/v1/admin/master/product/update.remark.status');


const cpUpload = uploadImages.fields([
  { name: "product_image", maxCount: 1 },
])

router.post('/add', adminMiddleware.checkAccess(), cpUpload, addComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/export/csv', adminMiddleware.checkAccess(), CsvexportDataComponent);
router.post('/import/csv', adminMiddleware.checkAccess(), uploadCsv.single('file'), CsvimportDataComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.get('/pending', adminMiddleware.checkAccess(), fetchAllpendingComponent);

router.put('/remark', adminMiddleware.checkAccess(), fetchRemarkComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.put('/update',  cpUpload, updateComponent);
router.put('/status', adminMiddleware.checkAccess(), joiMiddleware.joiBodyMiddleware(joiSchemas.changeStatus, 'product'), statusChangeComponent);


module.exports = router;
