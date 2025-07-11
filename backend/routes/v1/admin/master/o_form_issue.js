const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/master/o_form_issue/add.o_form_issue');
;
const fetchAllComponent = require('../../../../components/v1/admin/master/o_form_issue/fetchall.o_form_issue');
const fetchOneComponent = require('../../../../components/v1/admin/master/o_form_issue/fetch.one.o_form_issue');
const emailComponent = require('../../../../components/v1/admin/master/o_form_issue/send.email');



router.post('/add',adminMiddleware.checkAccess(),  addComponent);
router.post('/send/email', emailComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchOneComponent);




module.exports = router;