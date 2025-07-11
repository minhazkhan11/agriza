const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');
const { upload, file, uploadFileMemory } = require("../../../../lib/utils/multer");


const Entitybasic = require('../../../../components/v1/admin/usersnew/businessentitybasic/add.businessentitybasic');

const NewEntitybasic = require('../../../../components/v1/admin/usersnew/businessentitybasic/add.customer.and.vender');
const deleteComponent = require('../../../../components/v1/admin/usersnew/businessentitybasic/delete.businessentitybasic');
const fetchAllComponent = require('../../../../components/v1/admin/usersnew/businessentitybasic/fetchall.businessentitybasic');
const fetchoneComponent = require('../../../../components/v1/admin/usersnew/businessentitybasic/fetch.one.businessentitybasic');
const updateComponent = require('../../../../components/v1/admin/usersnew/businessentitybasic/update.businessentitybasic');
const statusChangeComponent = require('../../../../components/v1/admin/usersnew/businessentitybasic/changestatus.businessentitybasic');
const fetchusegatoneComponent = require('../../../../components/v1/admin/usersnew/businessentitybasic/fetchby.gst.and.pan.businessentitybasic');

const fetchprofileComponent = require('../../../../components/v1/admin/usersnew/businessentitybasic/profile');

const fetchoneusertypeComponent = require('../../../../components/v1/admin/usersnew/businessentitybasic/fetchall.by.user_type.businessentitybasic');


const fetchonebeIdTOPersonComponent = require('../../../../components/v1/admin/usersnew/businessentitybasic/fetch.one.be_id_to_person');
const deleteparsonComponent = require('../../../../components/v1/admin/usersnew/businessentitybasic/delete.businessentitybasic_parson');
const cpUpload = uploadFileMemory.fields([
  { name: "logo", maxCount: 1 },
  // { name: "photo", maxCount: 1 },
  // { name: "aadhar_upload", maxCount: 1 },
  // { name: "pan_upload", maxCount: 1 }
]);


router.post('/add', adminMiddleware.checkAccess(), cpUpload, Entitybasic);
router.post('/customer', adminMiddleware.checkAccess(), cpUpload, NewEntitybasic);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.get('/user_type/:user_type', adminMiddleware.checkAccess(), fetchoneusertypeComponent);
router.put('/update', adminMiddleware.checkAccess(), cpUpload, updateComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);
router.post('/gstpan', adminMiddleware.checkAccess(), fetchusegatoneComponent);
router.post('/profile', fetchprofileComponent);
router.get('/person/:id', adminMiddleware.checkAccess(), fetchonebeIdTOPersonComponent);
router.delete('/parson/:id', adminMiddleware.checkAccess(), deleteparsonComponent);


module.exports = router;