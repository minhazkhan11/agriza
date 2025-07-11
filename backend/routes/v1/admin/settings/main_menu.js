const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const fetchAllComponent = require('../../../../components/v1/admin/settings/main_menu/fetch.main.Menu');
const addnewComponent = require('../../../../components/v1/admin/settings/main_menu/test');
// const deleteComponent = require('../../../../components/v1/admin/master/Place/delete.place');
const addComponent = require('../../../../components/v1/admin/settings/main_menu/add.main_menu');
const fetchoneComponent = require('../../../../components/v1/admin/settings/main_menu/fetch.main_menu.by.menu_plan_id');
// const updateComponent = require('../../../../components/v1/admin/master/Place/update.place');
// const statusChangeComponent = require('../../../../components/v1/admin/master/Place/change.status');


router.post('/add', adminMiddleware.be_adminAccess(), addComponent);
router.post('/addnew', adminMiddleware.be_adminAccess(), addnewComponent);
// router.delete('/:id', adminMiddleware.adminAccess(), deleteComponent);
router.get('/', adminMiddleware.be_adminAccess(), fetchAllComponent);
router.get('/:menu_plan_id', adminMiddleware.be_adminAccess(), fetchoneComponent);
// router.put('/update', adminMiddleware.adminAccess(), updateComponent);
// router.put('/status', adminMiddleware.adminAccess(),joiMiddleware.joiBodyMiddleware(joiSchemas.changeStatus, 'place'),  statusChangeComponent);


module.exports = router;