const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const fetchonecategoryComponent = require('../../../../components/v1/admin/master/auth/fetch.one.person');


router.get('/:id', fetchonecategoryComponent);



module.exports = router;