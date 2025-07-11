const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addattributesComponent = require('../../../../components/v1/admin/master/attributes/add.attributes');
const deleteattributesComponent = require('../../../../components/v1/admin/master/attributes/delete.attributes');
const fetchAllattributesComponent = require('../../../../components/v1/admin/master/attributes/fetch.attributes');
const fetchoneattributesComponent = require('../../../../components/v1/admin/master/attributes/fetch.one.attributes');
const updateattributesComponent = require('../../../../components/v1/admin/master/attributes/update.attributes');
const statusChangeComponent = require('../../../../components/v1/admin/master/attributes/change.status');



router.post('/add',adminMiddleware.be_adminAccess(), addattributesComponent);
router.delete('/:id', adminMiddleware.be_adminAccess(), deleteattributesComponent);
router.get('/', adminMiddleware.be_adminAccess(), fetchAllattributesComponent);
router.get('/:id', adminMiddleware.be_adminAccess(), fetchoneattributesComponent);
router.put('/update', adminMiddleware.be_adminAccess(), updateattributesComponent);
router.put('/status', adminMiddleware.be_adminAccess(),joiMiddleware.joiBodyMiddleware(joiSchemas.changeStatus, 'attributes'),  statusChangeComponent);


module.exports = router