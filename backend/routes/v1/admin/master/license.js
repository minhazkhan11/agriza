const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const { file, uploadFileMemory, uploadImages } = require("../../../../lib/utils/multer");
const multer = require("multer");

const adminMiddleware = require('../../../../middlewares/admin.middleware');

const adddetails = require('../../../../components/v1/admin/master/license/add.license_details');
const deleteComponent = require('../../../../components/v1/admin/master/license/delete.license_details');
const fetchAllComponent = require('../../../../components/v1/admin/master/license/fetchall.license_details');
const updateComponent = require('../../../../components/v1/admin/master/license/updata.license_details');
const statusChangeComponent = require('../../../../components/v1/admin/master/license/changestatus.license_details');
const fetchoneComponent = require('../../../../components/v1/admin/master/license/fetchone.license_details');
const fetchoneself_o_formComponent = require('../../../../components/v1/admin/master/license/fetchone.self_o_form');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size (e.g., 5MB)
}).fields([
  { name: "signatureandseal", maxCount: 1 },
  // { name: "seal", maxCount: 1 },
  { name: "license", maxCount: 1 }
]);

router.post('/add', adminMiddleware.checkAccess(), upload, adddetails);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.put('/update', adminMiddleware.checkAccess(), upload, updateComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);
router.get('/self_o_form/:id', adminMiddleware.checkAccess(), fetchoneself_o_formComponent);

module.exports = router;    