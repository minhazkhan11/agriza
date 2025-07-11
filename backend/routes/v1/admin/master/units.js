const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/master/units/add.units');
const deleteComponent = require('../../../../components/v1/admin/master/units/delete.units');
const fetchAllComponent = require('../../../../components/v1/admin/master/units/fetch.units');
const fetchoneComponent = require('../../../../components/v1/admin/master/units/fetch.one.units');
const updateComponent = require('../../../../components/v1/admin/master/units/update.units');
const statusChangeComponent = require('../../../../components/v1/admin/master/units/change.status');


router.post('/add', adminMiddleware.checkAccess(), addComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.put('/update', adminMiddleware.checkAccess(), updateComponent);
router.put('/status', adminMiddleware.checkAccess(), joiMiddleware.joiBodyMiddleware(joiSchemas.changeStatus, 'units'), statusChangeComponent);


module.exports = router;