const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addCategoryComponent = require('../../../../components/v1/admin/master/category/add.category');
const deletecategoryComponent = require('../../../../components/v1/admin/master/category/delete.category');
const fetchAllcategoryComponent = require('../../../../components/v1/admin/master/category/fetch.category');
const fetchonecategoryComponent = require('../../../../components/v1/admin/master/category/fetch.one.category');
const updatecategoryComponent = require('../../../../components/v1/admin/master/category/update.category');
const statusChangeComponent = require('../../../../components/v1/admin/master/category/change.status');
const actionChangeComponent = require('../../../../components/v1/admin/master/category/change.action');


router.post('/add',adminMiddleware.checkAccess(),joiMiddleware.joiBodyMiddleware(joiSchemas.addcategory, 'category'), addCategoryComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deletecategoryComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllcategoryComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchonecategoryComponent);
router.put('/update', adminMiddleware.checkAccess(), updatecategoryComponent);
router.put('/status', adminMiddleware.checkAccess(),joiMiddleware.joiBodyMiddleware(joiSchemas.changeStatus, 'category'),  statusChangeComponent);
router.put('/action', adminMiddleware.checkAccess(),joiMiddleware.joiBodyMiddleware(joiSchemas.actionChange, 'category'),  actionChangeComponent);


module.exports = router;