const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const fetchAllcountryComponent = require('../../../../components/v1/admin/master/constitution/fetch.all.constitution');



router.get('/', adminMiddleware.be_adminAccess(), fetchAllcountryComponent);



module.exports = router;