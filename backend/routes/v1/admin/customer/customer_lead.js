const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const { upload, uploadCsv } = require("../../../../lib/utils/multer");
const adminMiddleware = require('../../../../middlewares/admin.middleware');



// const addComponent = require('../../../../components/v1/admin/be_information/product/product_price/add.product_price');

const ImportCsvComponent = require('../../../../components/v1/admin/customer/customer_lead/import.csv.customer_lead');
const ExportCsvComponent = require('../../../../components/v1/admin/customer/customer_lead/export.csv.customer_lead')


// router.post('/add', adminMiddleware.be_adminAccess(), addComponent);
router.post('/import/csv', adminMiddleware.be_adminAccess(), uploadCsv.single('file'), ImportCsvComponent);
router.get('/export/csv', adminMiddleware.be_adminAccess(), ExportCsvComponent);



module.exports = router;