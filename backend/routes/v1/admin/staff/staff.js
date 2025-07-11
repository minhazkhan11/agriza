const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');
const { file, upload, uploadFileMemory } = require("../../../../lib/utils/multer");

const addComponent = require('../../../../components/v1/admin/be_information/product/staff/add');
const deleteComponent = require('../../../../components/v1/admin/be_information/product/staff/delete');
// const fetchAllComponent = require('../../../../components/v1/admin/be_information/product/staff/fetch');
const fetchAllComponent = require('../../../../components/v1/admin/be_information/product/staff/fetch.superadmin');
const fetchoneComponent = require('../../../../components/v1/admin/be_information/product/staff/fetch.one');
const updateComponent = require('../../../../components/v1/admin/be_information/product/staff/update.staffqqq');
const statusChangeComponent = require('../../../../components/v1/admin/be_information/product/staff/change.status');
// const addAssignedComponent = require('../../../../components/v1/admin/be_information/product/staff/staff.assigned');

const cpUpload = uploadFileMemory.fields([
  { name: "staff_photo", maxCount: 1 },
  { name: "pan_upload", maxCount: 1 },
  { name: "aadhar_upload", maxCount: 1 },
])


router.post('/add', adminMiddleware.checkAccess(), cpUpload, addComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.get('/:user_id', adminMiddleware.checkAccess(), fetchoneComponent);
router.put('/update', adminMiddleware.checkAccess(), cpUpload, updateComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);

// router.post('/assigned', adminMiddleware.checkAccess(), upload, addAssignedComponent);

module.exports = router;