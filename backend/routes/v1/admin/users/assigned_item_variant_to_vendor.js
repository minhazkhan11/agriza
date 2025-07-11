const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');


const addComponent = require('../../../../components/v1/admin/usersnew/assigned_item_variant_to_vendor/add.assigne_item');
const fetchAllComponent = require('../../../../components/v1/admin/usersnew/assigned_item_variant_to_vendor/fetch.assigned_item_variant_to_vendor');
const fetchAllBEIDComponent = require('../../../../components/v1/admin/usersnew/assigned_item_variant_to_vendor/fetch.be_id.assigned_item_variant_to_vendor');
router.post('/add', addComponent);
// router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.get('/be_id/:vendor_be_id', adminMiddleware.checkAccess(), fetchAllBEIDComponent);
// router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);


module.exports = router;