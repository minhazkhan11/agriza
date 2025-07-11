const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addrakeComponent = require('../../../../components/v1/admin/master/rake/add.rake');
const deleterakeComponent = require('../../../../components/v1/admin/master/rake/delete.rake');
const fetchAllrakeComponent = require('../../../../components/v1/admin/master/rake/fetch.rake');
const fetchonerakeComponent = require('../../../../components/v1/admin/master/rake/fetch.one.rake');
const updaterakeComponent = require('../../../../components/v1/admin/master/rake/update.rake');
const statusChangeComponent = require('../../../../components/v1/admin/master/rake/change.status');
const rake = require('../../../../models/rake');


router.post('/add', adminMiddleware.checkAccess(), addrakeComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleterakeComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllrakeComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchonerakeComponent);
router.put('/update', adminMiddleware.checkAccess(), updaterakeComponent);
router.put('/status', adminMiddleware.checkAccess(), joiMiddleware.joiBodyMiddleware(joiSchemas.changeStatus, 'rake'), statusChangeComponent);


module.exports = router