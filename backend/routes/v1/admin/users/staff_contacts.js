const express = require('express');
const router = express.Router();
const { file, upload, uploadFileMemory } = require("../../../../lib/utils/multer");
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const staffcontacts = require('../../../../components/v1/admin/usersnew/staff_contacts/add.staff_contacts');
const deleteComponent = require('../../../../components/v1/admin/usersnew/staff_contacts/delete.staff_contacts');
const updateComponent = require('../../../../components/v1/admin/usersnew/staff_contacts/update.staff_contacts');
const statusChangeComponent = require('../../../../components/v1/admin/usersnew/staff_contacts/changestatus.staff_contacts')
const fetchAllComponent = require('../../../../components/v1/admin/usersnew/staff_contacts/fetch.all.staff_contacts')



const cpUpload = uploadFileMemory.fields([
  { name: "photo", maxCount: 1 },
  { name: "aadhar_upload", maxCount: 1 },
  { name: "pan_upload", maxCount: 1 },
]);





router.post('/add', adminMiddleware.checkAccess(), cpUpload, staffcontacts);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.put('/update', adminMiddleware.checkAccess(), updateComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);


module.exports = router;