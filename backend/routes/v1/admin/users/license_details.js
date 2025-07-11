const express = require('express');
const router = express.Router();
const { upload, file } = require("../../../../lib/utils/multer");
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const adddcomponent = require('../../../../components/v1/admin/usersnew/license_details/add.license_details');
const fetchonecountryComponent = require('../../../../components/v1/admin/usersnew/license_details/fetch.one.license_details');
const fetchAllComponent = require('../../../../components/v1/admin/usersnew/license_details/fetchall.license_details')
const deletecountryComponent = require('../../../../components/v1/admin/usersnew/license_details/delete.license_details')
const statusChangeComponent = require('../../../../components/v1/admin/usersnew/license_details/changestatus.license_details')

const cpUpload = file.fields([
  { name: "signature", maxCount: 1 },
  { name: "seal", maxCount: 1 },
  { name: "license", maxCount: 1 },
]);

router.post('/add', adminMiddleware.checkAccess(), cpUpload, adddcomponent);
router.delete('/:id', adminMiddleware.checkAccess(), deletecountryComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchonecountryComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
// router.put('/update', adminMiddleware.checkAccess(), updatecountryComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);


module.exports = router;