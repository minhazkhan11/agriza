const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addemailComponent = require('../../../../components/v1/admin/master/advisoremail/add.email');
const fetchAllemailComponent = require('../../../../components/v1/admin/master/advisoremail/fetch.email');


router.post('/add', addemailComponent);
router.get('/', fetchAllemailComponent);


module.exports = router