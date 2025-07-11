const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');
const { file, upload, uploadFileMemory } = require("../../../../lib/utils/multer");

const addComponent = require('../../../../components/v1/admin/master/sub_expense/add.sub_expense');
const deleteComponent = require('../../../../components/v1/admin/master/sub_expense/delete.sub_expense');
const fetchAllComponent = require('../../../../components/v1/admin/master/sub_expense/fetchall.sub_expense');

const fetchoneComponent = require('../../../../components/v1/admin/master/sub_expense/fetch.one.sub_expense');
const updateComponent = require('../../../../components/v1/admin/master/sub_expense/update.sub_expense');
const statusChangeComponent = require('../../../../components/v1/admin/master/sub_expense/changestatus.sub_expense');
const fetchbyIDComponent = require('../../../../components/v1/admin/master/sub_expense/fetch.all.by.expense_id.sub_expense');

const cpUpload = uploadFileMemory.fields([
  { name: "expense_photo", maxCount: 1 },
]);

router.post('/add', cpUpload, addComponent);
router.delete('/:id', deleteComponent);
router.get('/', fetchAllComponent);
router.get('/:id', fetchoneComponent);
router.get('/expense_id/:id', fetchbyIDComponent);
router.put('/update', cpUpload, updateComponent);
router.put('/status', statusChangeComponent);


module.exports = router;