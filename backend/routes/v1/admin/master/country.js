const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const addcountryComponent = require('../../../../components/v1/admin/master/country/add.country');
const deletecountryComponent = require('../../../../components/v1/admin/master/country/delete.country');
const fetchAllcountryComponent = require('../../../../components/v1/admin/master/country/fetch.country');
const fetchonecountryComponent = require('../../../../components/v1/admin/master/country/fetch.one.country');
const updatecountryComponent = require('../../../../components/v1/admin/master/country/update.country');
const statusChangeComponent = require('../../../../components/v1/admin/master/country/change.status');


router.post('/add',adminMiddleware.checkAccess(),joiMiddleware.joiBodyMiddleware(joiSchemas.addcountry, 'country'), addcountryComponent);
router.delete('/:id', adminMiddleware.checkAccess(), deletecountryComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllcountryComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchonecountryComponent);
router.put('/update', adminMiddleware.checkAccess(), updatecountryComponent);
router.put('/status', adminMiddleware.checkAccess(),joiMiddleware.joiBodyMiddleware(joiSchemas.changeStatus, 'country'),  statusChangeComponent);


module.exports = router;