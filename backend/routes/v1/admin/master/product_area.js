const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/master/Product_area/add.pro');
const deleteComponent = require('../../../../components/v1/admin/master/Product_area/delete.pro');
const fetchAllComponent = require('../../../../components/v1/admin/master/Product_area/fetch.pro');
const fetchoneComponent = require('../../../../components/v1/admin/master/Product_area/fetch.one.pro');
const updateComponent = require('../../../../components/v1/admin/master/Product_area/update.pro');
const statusChangeComponent = require('../../../../components/v1/admin/master/Product_area/change.status');

router.post('/add', adminMiddleware.checkAccess(),  addComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.put('/update', adminMiddleware.checkAccess(), updateComponent);
router.put('/status', adminMiddleware.checkAccess(), joiMiddleware.joiBodyMiddleware(joiSchemas.changeStatus, 'product_area'), statusChangeComponent);


module.exports = router;