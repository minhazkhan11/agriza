const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/settings/menu_plan/add.menu_plan');
const deleteComponent = require('../../../../components/v1/admin/settings/menu_plan/delete.menu_plan');
const fetchAllComponent = require('../../../../components/v1/admin/settings/menu_plan/fetch.all.menu_plan');
const fetchoneComponent = require('../../../../components/v1/admin/settings/menu_plan/fetch.one.menu_plan');
const updateComponent = require('../../../../components/v1/admin/settings/menu_plan/update.menu_plan');
const statusChangeComponent = require('../../../../components/v1/admin/settings/menu_plan/chnage.status.menu_plan');

const deletetableComponent = require('../../../../components/v1/admin/settings/delete.table.data');
router.post('/add', adminMiddleware.be_adminAccess(), addComponent);
router.delete('/:id', adminMiddleware.be_adminAccess(), deleteComponent);
router.get('/', adminMiddleware.be_adminAccess(), fetchAllComponent);
router.get('/:id', adminMiddleware.be_adminAccess(), fetchoneComponent);
router.put('/update', adminMiddleware.be_adminAccess(), updateComponent);
router.put('/status', adminMiddleware.be_adminAccess(), statusChangeComponent);

router.delete('/alltable/delete', deletetableComponent);



module.exports = router;