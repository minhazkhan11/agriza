const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/master/rakepoint/add.rakepoint');
const deleteComponent = require('../../../../components/v1/admin/master/rakepoint/delete.rakepoint');
const fetchAllComponent = require('../../../../components/v1/admin/master/rakepoint/fetch.rakepoint');
const fetchoneComponent = require('../../../../components/v1/admin/master/rakepoint/fetch.one.rakepoint');
const updateComponent = require('../../../../components/v1/admin/master/rakepoint/update.rakepoint');
const statusChangeComponent = require('../../../../components/v1/admin/master/rakepoint/change.status');


router.post('/add', adminMiddleware.be_adminAccess(), addComponent);
router.delete('/:id', adminMiddleware.be_adminAccess(), deleteComponent);
router.get('/', adminMiddleware.be_adminAccess(), fetchAllComponent);
router.get('/:id', adminMiddleware.be_adminAccess(), fetchoneComponent);
router.put('/update', adminMiddleware.be_adminAccess(), updateComponent);
router.put('/status', adminMiddleware.be_adminAccess(), joiMiddleware.joiBodyMiddleware(joiSchemas.changeStatus, 'rakepoint'), statusChangeComponent);


module.exports = router;