const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addComponent = require('../../../../components/v1/admin/master/ship_to_party/add.ship_to_party');
const deleteComponent = require('../../../../components/v1/admin/master/ship_to_party/delete.ship_to_party');
const fetchAllComponent = require('../../../../components/v1/admin/master/ship_to_party/fetch.all.cusrtomer.be_information');
const fetchoneComponent = require('../../../../components/v1/admin/master/ship_to_party/fetch.ship_to_party');
const updateComponent = require('../../../../components/v1/admin/master/ship_to_party/update.ship_to_party');
const fetchbyIdComponent = require('../../../../components/v1/admin/master/ship_to_party/fetch.one.ship_to_party');
const statusChangeComponent = require('../../../../components/v1/admin/master/ship_to_party/change.status.ship_to_party');


router.post('/add', addComponent);
router.delete('/:id', adminMiddleware.be_adminAccess(), deleteComponent);
router.get('/:id', fetchbyIdComponent);
router.get('/customer/be_information', adminMiddleware.be_adminAccess(), fetchAllComponent);
router.get('/', fetchoneComponent);
router.put('/update', updateComponent);
router.put('/status', statusChangeComponent);


module.exports = router;