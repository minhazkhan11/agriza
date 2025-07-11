const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/master/logistic_area/add.logistic');
const deleteComponent = require('../../../../components/v1/admin/master/logistic_area/delete.logistic');
const fetchAllComponent = require('../../../../components/v1/admin/master/logistic_area/fetch.logistic');
const fetchoneComponent = require('../../../../components/v1/admin/master/logistic_area/fetch.one.logistic');
const updateComponent = require('../../../../components/v1/admin/master/logistic_area/update.logistic');
const statusChangeComponent = require('../../../../components/v1/admin/master/logistic_area/change.status');

router.post('/add', adminMiddleware.checkAccess(),  addComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deleteComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchoneComponent);
router.put('/update', updateComponent);
router.put('/status', adminMiddleware.checkAccess(), joiMiddleware.joiBodyMiddleware(joiSchemas.changeStatus, 'logistic_area'), statusChangeComponent);


module.exports = router;