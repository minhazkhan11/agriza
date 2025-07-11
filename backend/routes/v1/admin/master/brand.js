const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');
const { file, upload, uploadFileMemory } = require("../../../../lib/utils/multer");

const addComponent = require('../../../../components/v1/admin/master/brand/add.brand');
const deleteComponent = require('../../../../components/v1/admin/master/brand/delele.brand');
const fetchAllComponent = require('../../../../components/v1/admin/master/brand/fetchall.brand');
const fetchAuthAllComponent = require('../../../../components/v1/admin/master/brand/fetchall.brand.pending');
const fetchoneauthComponent = require('../../../../components/v1/admin/master/brand/fetch.one.brand.pending');
const fetchoneComponent = require('../../../../components/v1/admin/master/brand/fetch.one.brand');
const updateComponent = require('../../../../components/v1/admin/master/brand/update.brand');
const statusChangeComponent = require('../../../../components/v1/admin/master/brand/changestatus.brand');
const RimarkComponent = require('../../../../components/v1/admin/master/brand/remark.brand');
const fetchbyMarketersIdComponent = require('../../../../components/v1/admin/master/brand/fetch.brandBymarketerid')


const cpUpload = uploadFileMemory.fields([
  { name: "brand_image", maxCount: 1 },
])

router.post('/add', adminMiddleware.checkAccess(), cpUpload, addComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.get('/marketers_id/:id', adminMiddleware.checkAccess(), fetchbyMarketersIdComponent);
router.put('/update', adminMiddleware.checkAccess(), cpUpload, updateComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);


router.get('/auth/pending', adminMiddleware.checkAccess(), fetchAuthAllComponent);
router.put('/auth/remark/update', adminMiddleware.checkAccess(), RimarkComponent);
router.get('/auth/pending/:id', adminMiddleware.checkAccess(), fetchoneauthComponent);

module.exports = router;