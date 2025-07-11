const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/master/lead_Category/add');
const deleteComponent = require('../../../../components/v1/admin/master/lead_Category/delete');
const fetchAllComponent = require('../../../../components/v1/admin/master/lead_Category/fetch');
const fetchoneComponent = require('../../../../components/v1/admin/master/lead_Category/fetch.one');
const updateComponent = require('../../../../components/v1/admin/master/lead_Category/update');
const statusChangeComponent = require('../../../../components/v1/admin/master/lead_Category/change.status');

router.post('/add', adminMiddleware.checkAccess(),  addComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.put('/update', adminMiddleware.checkAccess(), updateComponent);
router.put('/status', adminMiddleware.checkAccess(), joiMiddleware.joiBodyMiddleware(joiSchemas.changeStatus, 'lead_category'), statusChangeComponent);


module.exports = router;