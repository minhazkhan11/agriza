const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/master/Place/add.place');
const deleteComponent = require('../../../../components/v1/admin/master/Place/delete.place');
const fetchAllComponent = require('../../../../components/v1/admin/master/Place/fetch.place');
const fetchoneComponent = require('../../../../components/v1/admin/master/Place/fetch.one.place');
const updateComponent = require('../../../../components/v1/admin/master/Place/update.place');
const statusChangeComponent = require('../../../../components/v1/admin/master/Place/change.status');
const fetchbypinIdComponent = require('../../../../components/v1/admin/master/Place/fetch.plase.by.pin_id');
const fetchbypinIdsComponent = require('../../../../components/v1/admin/master/Place/fetch.plase.by.pin_ids');

router.post('/add', adminMiddleware.checkAccess(), joiMiddleware.joiBodyMiddleware(joiSchemas.addplace, 'place'), addComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.get('/pin_id/:id', adminMiddleware.checkAccess(), fetchbypinIdComponent);
router.post('/pin_ids', adminMiddleware.checkAccess(), fetchbypinIdsComponent);
router.put('/update', adminMiddleware.checkAccess(), updateComponent);
router.put('/status', adminMiddleware.checkAccess(), joiMiddleware.joiBodyMiddleware(joiSchemas.changeStatus, 'place'), statusChangeComponent);


module.exports = router;