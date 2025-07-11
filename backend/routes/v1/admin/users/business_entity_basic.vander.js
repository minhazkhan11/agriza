const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');
const { upload, file, uploadFileMemory } = require("../../../../lib/utils/multer");




const NewEntitybasic = require('../../../../components/v1/admin/usersnew/businessentitybasic/add.customer.and.vender');
const deleteComponent = require('../../../../components/v1/admin/usersnew/businessentitybasic/delete.businessentitybasic');
const fetchAllComponent = require('../../../../components/v1/admin/usersnew/businessentitybasic/fetchall.businessentitybasic');
const fetchoneComponent = require('../../../../components/v1/admin/usersnew/businessentitybasic/fetch.one.businessentitybasic');
const updateComponent = require('../../../../components/v1/admin/usersnew/businessentitybasic/update.businessentitybasic');
const statusChangeComponent = require('../../../../components/v1/admin/usersnew/businessentitybasic/changestatus.businessentitybasic');
const fetchusegatoneComponent = require('../../../../components/v1/admin/usersnew/businessentitybasic/fetchby.gst.and.pan.businessentitybasic.vender');

const fetchoneusertypeComponent = require('../../../../components/v1/admin/usersnew/businessentitybasic/fetchall.by.user_type.businessentitybasic');


const fetchonebeIdTOPersonComponent = require('../../../../components/v1/admin/usersnew/businessentitybasic/fetch.one.be_id_to_person');

const fetchallvendorComponent = require('../../../../components/v1/admin/usersnew/businessentitybasic/fetchall.be_vendor');


const bechangeStatusComponent = require('../../../../components/v1/admin/usersnew/businessentitybasic/change.status.customer.and.vender.businessentitybasic');
const deleteComponentbe = require('../../../../components/v1/admin/usersnew/businessentitybasic/delete.customer.and.vender.businessentitybasic');

const cpUpload = uploadFileMemory.fields([
  { name: "logo", maxCount: 1 },
  // { name: "photo", maxCount: 1 },
  // { name: "aadhar_upload", maxCount: 1 },
  // { name: "pan_upload", maxCount: 1 }
]);


router.post('/add', adminMiddleware.checkAccess(), cpUpload, NewEntitybasic);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.get('/user_type/:user_type', adminMiddleware.checkAccess(), fetchoneusertypeComponent);
router.put('/update', adminMiddleware.checkAccess(), cpUpload, updateComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);
router.post('/gstpan', adminMiddleware.checkAccess(), fetchusegatoneComponent);
router.get('/person/:id', adminMiddleware.checkAccess(), fetchonebeIdTOPersonComponent);
router.get('/be/vendor', adminMiddleware.checkAccess(), fetchallvendorComponent);


router.put('/be/status', adminMiddleware.checkAccess(), bechangeStatusComponent);

router.delete('/be/:id', adminMiddleware.checkAccess(), deleteComponentbe);


module.exports = router;