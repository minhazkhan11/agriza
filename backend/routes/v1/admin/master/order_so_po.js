const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');
const { file, upload, uploadFileMemory } = require("../../../../lib/utils/multer");
const addComponent = require('../../../../components/v1/admin/master/order_so_po/add');
// const deleteComponent = require('../../../../components/v1/admin/master/item_variants.js/delete');
const fetchAllComponent = require('../../../../components/v1/admin/master/order_so_po/fetch.all');
const fetchBYIDComponent = require('../../../../components/v1/admin/master/order_so_po/fetch.one.js');
const fetchAllSoComponent = require('../../../../components/v1/admin/master/order_so_po/fetch.all.so');
const fetchAllPoComponent = require('../../../../components/v1/admin/master/order_so_po/fetch.all.po');
const statusChangeComponent = require('../../../../components/v1/admin/master/order_so_po/change.status');
const fetchbybeIdComponent = require('../../../../components/v1/admin/master/ship_to_party/fetch.ship_party.customer');
const DispatchComponent = require('../../../../components/v1/admin/master/order_so_po/order_status.dispatch');

const PODispatchComponent = require('../../../../components/v1/admin/master/order_so_po/order_status.po_dispatch.js');
const SODispatchComponent = require('../../../../components/v1/admin/master/order_so_po/order_status.so_dispatch.js');

const updateComponent = require('../../../../components/v1/admin/master/order_so_po/update_so_po.js');
const dispatchOederComponent = require('../../../../components/v1/admin/master/order_so_po/order_dispatch.js');
const GetAllDispatchOederComponent = require('../../../../components/v1/admin/master/order_so_po/fetch.all.order_dispatch.js');



const cpUpload = uploadFileMemory.fields([
  { name: "order_image", maxCount: 1 },
]);

router.post('/add',adminMiddleware.checkAccess(),  addComponent);
// router.delete('/:id', deleteComponent);
router.get('/', adminMiddleware.checkAccess(), cpUpload, fetchAllComponent);
router.get('/:id', adminMiddleware.checkAccess(), cpUpload, fetchBYIDComponent);
router.get('/get_all/so', adminMiddleware.checkAccess(), fetchAllSoComponent);
router.get('/get_all/po', adminMiddleware.checkAccess(), fetchAllPoComponent);
router.get('/customer/ship_to_party/:be_id', fetchbybeIdComponent);
router.get('/dispatch/all', adminMiddleware.checkAccess(), DispatchComponent);
router.get('/dispatch/get_all/po', adminMiddleware.checkAccess(), PODispatchComponent);
router.get('/dispatch/get_all/so', adminMiddleware.checkAccess(), SODispatchComponent);
router.put('/update',adminMiddleware.checkAccess(),  updateComponent);
// router.post('/item_variant_price', updatepriceComponent);
// router.get('/item_variant_price_list/:item_variants_id', fetchAllvarintpricelistComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);
router.put('/order/dispatch',adminMiddleware.checkAccess(),  dispatchOederComponent);
router.get('/order/dispatch', adminMiddleware.checkAccess(), GetAllDispatchOederComponent);


module.exports = router;

