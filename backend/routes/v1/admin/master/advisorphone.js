const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addphoneComponent = require('../../../../components/v1/admin/master/advisorphone/add.phone');
const fetchAllphoneComponent = require('../../../../components/v1/admin/master/advisorphone/fetch.phone');



router.post('/add', addphoneComponent);
router.get('/',  fetchAllphoneComponent);



module.exports = router