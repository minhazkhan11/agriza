const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/settings/integrated_module_plans/add.Integrated_module_plans');

const fetchAllComponent = require('../../../../components/v1/admin/settings/integrated_module_plans/fetch.all.integrated.module.plans');
// const deleteComponent = require('../../../../components/v1/admin/master/Place/delete.place');
// const fetchoneComponent = require('../../../../components/v1/admin/master/Place/fetch.one.place');
// const updateComponent = require('../../../../components/v1/admin/master/Place/update.place');
// const statusChangeComponent = require('../../../../components/v1/admin/master/Place/change.status');


router.post('/add', adminMiddleware.be_adminAccess(), addComponent);
router.get('/', adminMiddleware.be_adminAccess(), fetchAllComponent);
// router.delete('/:id', adminMiddleware.adminAccess(), deleteComponent);
// router.get('/', adminMiddleware.adminAccess(), fetchAllComponent);
// router.get('/:id', adminMiddleware.adminAccess(), fetchoneComponent);
// router.put('/update', adminMiddleware.adminAccess(), updateComponent);
// router.put('/status', adminMiddleware.adminAccess(),joiMiddleware.joiBodyMiddleware(joiSchemas.changeStatus, 'place'),  statusChangeComponent);


module.exports = router;