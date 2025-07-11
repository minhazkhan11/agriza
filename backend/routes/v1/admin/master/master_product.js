const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');


const addComponent = require('../../../../components/v1/admin/master/master_product/add.master_product');
const deleteComponent = require('../../../../components/v1/admin/master/master_product/delete.master_product');
const fetchAllComponent = require('../../../../components/v1/admin/master/master_product/fetchall.master_product');
const fetchoneComponent = require('../../../../components/v1/admin/master/master_product/fetch.one.master_product');
const updateComponent = require('../../../../components/v1/admin/master/master_product/update.master_product');
const statusChangeComponent = require('../../../../components/v1/admin/master/master_product/change.status.master_product');
const fetchAuthAllComponent = require('../../../../components/v1/admin/master/master_product/fetchall.master_product.pendding');
const RimarkComponent = require('../../../../components/v1/admin/master/master_product/remark.master_product');
const fetchoneauthComponent = require('../../../../components/v1/admin/master/master_product/fetch.one.master_product.pending');


router.post('/add', adminMiddleware.checkAccess(), addComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.put('/update', adminMiddleware.checkAccess(), updateComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);



router.get('/auth/pending', adminMiddleware.checkAccess(), fetchAuthAllComponent);
router.put('/auth/remark/update', adminMiddleware.checkAccess(), RimarkComponent);
router.get('/auth/pending/:id', adminMiddleware.checkAccess(), fetchoneauthComponent);


module.exports = router;