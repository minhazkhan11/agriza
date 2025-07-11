const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');
const { file, upload, uploadFileMemory } = require("../../../../lib/utils/multer");

const addComponent = require('../../../../components/v1/admin/master/marketers/add.marketers');
const deleteComponent = require('../../../../components/v1/admin/master/marketers/delete.marketers');
const fetchAllComponent = require('../../../../components/v1/admin/master/marketers/fetchall.marketers');
const fetchoneComponent = require('../../../../components/v1/admin/master/marketers/fetch.one.marketers');
const updateComponent = require('../../../../components/v1/admin/master/marketers/update.marketers');
const statusChangeComponent = require('../../../../components/v1/admin/master/marketers/changestatus.marketers');
const RimarkComponent = require('../../../../components/v1/admin/master/marketers/remark.marketer');
const fetchoneauthComponent = require('../../../../components/v1/admin/master/marketers/fetch.one.marketers.pending');
const fetchAuthAllComponent = require('../../../../components/v1/admin/master/marketers/fetchall.marketers.pending');


const cpUpload = uploadFileMemory.fields([
  { name: "photo", maxCount: 1 },
]);

router.post('/add', adminMiddleware.checkAccess(), cpUpload, addComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.put('/update', adminMiddleware.checkAccess(), cpUpload, updateComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);


router.get('/auth/pending', adminMiddleware.checkAccess(), fetchAuthAllComponent);
router.put('/auth/remark/update', adminMiddleware.checkAccess(), RimarkComponent);
router.get('/auth/pending/:id', adminMiddleware.checkAccess(), fetchoneauthComponent);


module.exports = router;