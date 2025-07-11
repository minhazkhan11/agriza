const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const { file, upload, uploadFileMemory } = require("../../../../lib/utils/multer");

const adminMiddleware = require('../../../../middlewares/admin.middleware');

const ownerdetails = require('../../../../components/v1/admin/usersnew/owner_details/add.owner_details');
const deletecountryComponent = require('../../../../components/v1/admin/usersnew/owner_details/delete.owner_details');
const fetchAllcountryComponent = require('../../../../components/v1/admin/usersnew/owner_details/fetchall.owner_details');
const updatecountryComponent = require('../../../../components/v1/admin/usersnew/owner_details/updata.owner_details');
const statusChangeComponent = require('../../../../components/v1/admin/usersnew/owner_details/changestatus.owner_details');


const cpUpload = uploadFileMemory.fields([
  { name: "photo", maxCount: 1 },
  { name: "aadhar_upload", maxCount: 1 },
  { name: "pan_upload", maxCount: 1 },
]);
router.post('/add', adminMiddleware.checkAccess(), cpUpload, ownerdetails);
router.delete('/:id', adminMiddleware.checkAccess(), deletecountryComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllcountryComponent);
router.put('/update', adminMiddleware.checkAccess(), updatecountryComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);


module.exports = router;    