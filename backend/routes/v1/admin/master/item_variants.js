const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/master/item_variants/add');
const deleteComponent = require('../../../../components/v1/admin/master/item_variants/delete');
const fetchAllComponent = require('../../../../components/v1/admin/master/item_variants/fetch.all');
const fetchAllvarintpricelistComponent = require('../../../../components/v1/admin/master/item_variants/list.item.variant.price');
const fetchoneComponent = require('../../../../components/v1/admin/master/item_variants/fetch.one');
const updateComponent = require('../../../../components/v1/admin/master/item_variants/update');
const statusChangeComponent = require('../../../../components/v1/admin/master/item_variants/change.status');
const updatepriceComponent = require('../../../../components/v1/admin/master/item_variants/update.item.variant.price');

router.post('/add', adminMiddleware.checkAccess(), addComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.put('/update', adminMiddleware.checkAccess(), updateComponent);
router.post('/item_variant_price', adminMiddleware.checkAccess(), updatepriceComponent);
router.get('/item_variant_price_list/:item_variants_id', adminMiddleware.checkAccess(), fetchAllvarintpricelistComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);


module.exports = router;