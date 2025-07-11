const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');
const dynamicUpload = require('../../../../middlewares/dynamic_upload')
const { file, upload, uploadFileMemory } = require("../../../../lib/utils/multer");

const addComponent = require('../../../../components/v1/admin/usersnew/be_documents/add.documents');
const fetchoneComponent = require('../../../../components/v1/admin/usersnew/be_documents/fetch.one.document');
const updateComponent = require('../../../../components/v1/admin/usersnew/be_documents/update.document');
const deleteComponent = require('../../../../components/v1/admin/usersnew/be_documents/delete.documents');
const uploadToS3Bucket = require('../../../../components/v1/admin/usersnew/be_documents/uplode.image.s3.bucket');


const cpUpload = uploadFileMemory.fields([
  { name: "photo", maxCount: 1 },
  { name: "aadhar_upload", maxCount: 1 },
  { name: "pan_upload", maxCount: 1 },
  { name: "license_image", maxCount: 1 },
  { name: "order_image", maxCount: 1 },
  { name: "gst_file", maxCount: 1 },
  { name: "payments_image", maxCount: 1 },
  { name: "activity_image", maxCount: 1 },
  { name: "dispatch_image", maxCount: 1 },
  { name: "o_form", maxCount: 1 },
  { name: "signatureandseal", maxCount: 1 },
  { name: "license", maxCount: 1 },
]);

router.post('/upload_to_s3bucket', cpUpload, uploadToS3Bucket);



router.post('/add', adminMiddleware.checkAccess(), dynamicUpload, addComponent);
router.delete('/:attachment_id', adminMiddleware.checkAccess(), deleteComponent);
// router.get('/', adminMiddleware.be_checkAccess(), fetchAllComponent);
router.get('/:be_information_id', adminMiddleware.checkAccess(), fetchoneComponent);
router.put('/update', adminMiddleware.checkAccess(), dynamicUpload, updateComponent);
// router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);





module.exports = router;