const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/master/district/add.district');
const deleteComponent = require('../../../../components/v1/admin/master/district/delete');
const fetchAllComponent = require('../../../../components/v1/admin/master/district/fetch');
const fetchoneComponent = require('../../../../components/v1/admin/master/district/fetch.one');
const updateComponent = require('../../../../components/v1/admin/master/district/update');
const statusChangeComponent = require('../../../../components/v1/admin/master/district/change.status');
const fetchallBystateIdComponent = require('../../../../components/v1/admin/master/district/fetch.state.by.district');
const fetchallBystateIdsComponent = require('../../../../components/v1/admin/master/district/fetch.state_ids.by.district');


router.post('/add', adminMiddleware.checkAccess(), joiMiddleware.joiBodyMiddleware(joiSchemas.adddistrict, 'district'), addComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.get('/state_id/:id', adminMiddleware.checkAccess(), fetchallBystateIdComponent);
router.post('/state_ids', adminMiddleware.checkAccess(), fetchallBystateIdsComponent);
router.put('/update', adminMiddleware.checkAccess(), updateComponent);
router.put('/status', adminMiddleware.checkAccess(), joiMiddleware.joiBodyMiddleware(joiSchemas.changeStatus, 'district'), statusChangeComponent);


module.exports = router;