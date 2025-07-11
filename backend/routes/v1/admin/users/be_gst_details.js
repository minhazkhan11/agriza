const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');


const addComponent = require('../../../../components/v1/admin/usersnew/be_gst_details/add.be_gst_details');
const fetchoneComponent = require('../../../../components/v1/admin/usersnew/be_gst_details/fetch.one.be_gst_details');
const fetchAllComponent = require('../../../../components/v1/admin/usersnew/be_gst_details/fetchall.be_gst_details');
const updateComponent = require('../../../../components/v1/admin/usersnew/be_gst_details/update.be_gst_details');
const deleteComponent = require('../../../../components/v1/admin/usersnew/be_gst_details/delete.be_gst_details');
const statusChangeComponent = require('../../../../components/v1/admin/usersnew/be_gst_details/changestatus.be_gst_details');
const deleteparsonComponent = require('../../../../components/v1/admin/usersnew/businessentitybasic/delete.businessentitybasic_parson');

const fetchAllBEIDComponent = require('../../../../components/v1/admin/usersnew/be_gst_details/fetchall.be_id.be_gst_details');

router.post('/add', adminMiddleware.checkAccess(), addComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.get('/be_id/:id', adminMiddleware.checkAccess(), fetchAllBEIDComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.put('/update', adminMiddleware.checkAccess(), updateComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);
router.delete('/parson/:id', adminMiddleware.checkAccess(), deleteparsonComponent);


module.exports = router;