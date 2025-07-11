const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const { upload, uploadCsv } = require("../../../../lib/utils/multer");
const adminMiddleware = require('../../../../middlewares/admin.middleware');



// const addComponent = require('../../../../components/v1/admin/be_information/product/product_price/add.product_price');

const ImportCsvComponent = require('../../../../components/v1/admin/vender/vender_lead/import.csv.vender_lead');
const ExportCsvComponent = require('../../../../components/v1/admin/vender/vender_lead/export.csv.vender_lead')


// router.post('/add', adminMiddleware.checkAccess(), addComponent);
router.post('/import/csv', adminMiddleware.checkAccess(), uploadCsv.single('file'), ImportCsvComponent);
router.get('/export/csv', adminMiddleware.checkAccess(), ExportCsvComponent);



module.exports = router;