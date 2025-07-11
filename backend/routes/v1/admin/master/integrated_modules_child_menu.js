const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const { upload, uploadCsv } = require("../../../../lib/utils/multer");
const adminMiddleware = require('../../../../middlewares/admin.middleware');



// const addComponent = require('../../../../components/v1/admin/be_information/product/product_price/add.product_price');

const ImportCsvComponent = require('../../../../components/v1/admin/settings/integrated_modules_child_menu/add.integrated_modules_child_menu');
// const AllComponent = require('../../../../components/v1/admin/master/uqc/fetch.all.uqc')



router.post('/import/csv', uploadCsv.single('file'), ImportCsvComponent);
// router.get('/', adminMiddleware.be_adminAccess(), AllComponent);



module.exports = router;