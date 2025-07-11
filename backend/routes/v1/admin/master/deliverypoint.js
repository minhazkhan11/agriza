const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');
const { file, upload, uploadFileMemory } = require("../../../../lib/utils/multer");

const addComponent = require('../../../../components/v1/admin/master/deliverypoint/add.ship');
const deleteComponent = require('../../../../components/v1/admin/master/deliverypoint/delete.ship');
const fetchAllComponent = require('../../../../components/v1/admin/master/deliverypoint/fetch.ship');
const fetchoneComponent = require('../../../../components/v1/admin/master/deliverypoint/fetch.one.ship');
const updateComponent = require('../../../../components/v1/admin/master/deliverypoint/update.ship');
const statusChangeComponent = require('../../../../components/v1/admin/master/deliverypoint/change.status');

const cpUpload = uploadFileMemory.fields([
  { name: "license_image", maxCount: 1 },
]);

router.post('/add', cpUpload, addComponent);
router.delete('/:id',  deleteComponent);
router.get('/',  fetchAllComponent);
router.get('/:id',  fetchoneComponent);
router.put('/update', updateComponent);
router.put('/status',   statusChangeComponent);


module.exports = router;