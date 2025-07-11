const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/master/gst_percent/add.gstpercent');
const deleteComponent = require('../../../../components/v1/admin/master/gst_percent/delete.gstpercent');
const fetchAllComponent = require('../../../../components/v1/admin/master/gst_percent/fetchall.gstpercent');
const fetchoneComponent = require('../../../../components/v1/admin/master/gst_percent/fetch.one.gstpercent');
const updateComponent = require('../../../../components/v1/admin/master/gst_percent/update.gstpercent');
const statusChangeComponent = require('../../../../components/v1/admin/master/gst_percent/changestatus.gstpercent');


router.post('/add', adminMiddleware.checkAccess(), addComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.put('/update', adminMiddleware.checkAccess(), updateComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);


module.exports = router;