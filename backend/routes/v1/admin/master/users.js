const express = require('express');
const router = express.Router();

const addUserComponent = require('../../../../components/v1/admin/master/users/add.user');


router.post('/add', addUserComponent);

module.exports = router;