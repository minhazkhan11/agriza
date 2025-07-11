// const express = require('express');
// const router = express.Router();
// const joiMiddleware = require('../../../../middlewares/joi.middleware');
// const joiSchemas = require('../../../../lib/utils/joi.schemas');
// const adminMiddleware = require('../../../../middlewares/admin.middleware');

// const addComponent = require('../../../../components/v1/admin/master/order_invoice/add.invoice_order');
// const deleteComponent = require('../../../../components/v1/admin/master/order_invoice/delete.invoice_order');
// const fetchAllComponent = require('../../../../components/v1/admin/master/order_invoice/fetchall.invoice_order');

// const fetchoneComponent = require('../../../../components/v1/admin/master/order_invoice/fetch.one.invoice_order');
// const updateComponent = require('../../../../components/v1/admin/master/order_invoice/update.invoice_order');
// const statusChangeComponent = require('../../../../components/v1/admin/master/order_invoice/update.invoice_order');

// router.post('/add', adminMiddleware.checkAccess(), addComponent);
// router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
// router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
// router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
// router.put('/update', adminMiddleware.checkAccess(), updateComponent);
// router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);


// module.exports = router;