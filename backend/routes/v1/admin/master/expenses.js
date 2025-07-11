const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/master/expense/add.expense');
const deleteComponent = require('../../../../components/v1/admin/master/expense/delete.expense');
const fetchAllComponent = require('../../../../components/v1/admin/master/expense/fetchall.expense');

const fetchoneComponent = require('../../../../components/v1/admin/master/expense/fetch.one.expense');
const updateComponent = require('../../../../components/v1/admin/master/expense/changestatus.expense');
const statusChangeComponent = require('../../../../components/v1/admin/master/expense/update.expense');

router.post('/add', addComponent);
router.delete('/:id', deleteComponent);
router.get('/', fetchAllComponent);
router.get('/:id', fetchoneComponent);
router.put('/update', updateComponent);
router.put('/status', statusChangeComponent);


module.exports = router;