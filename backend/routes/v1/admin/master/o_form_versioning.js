const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/master/o_form_versioning/add.o_form_versioning');
const deleteComponent = require('../../../../components/v1/admin/master/o_form_versioning/delete.o_form_versioning');
const fetchAllComponent = require('../../../../components/v1/admin/master/o_form_versioning/fetchall.o_form_versioning');
const fetchoneComponent = require('../../../../components/v1/admin/master/o_form_versioning/fetch.one.o_form_versioning');
const updateComponent = require('../../../../components/v1/admin/master/o_form_versioning/update.o_form_versioning');
const statusChangeComponent = require('../../../../components/v1/admin/master/o_form_versioning/changestatus.o_form_versioning');


router.post('/add',adminMiddleware.checkAccess(),  addComponent);
router.delete('/:id',adminMiddleware.checkAccess(),  deleteComponent);
router.get('/',adminMiddleware.checkAccess(),  fetchAllComponent);
router.get('/:id',adminMiddleware.checkAccess(),  fetchoneComponent);
router.put('/update',adminMiddleware.checkAccess(),  updateComponent);
router.put('/status',adminMiddleware.checkAccess(),  statusChangeComponent);


module.exports = router;