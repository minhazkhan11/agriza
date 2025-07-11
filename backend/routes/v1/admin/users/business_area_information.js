const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const area_information = require('../../../../components/v1/admin/usersnew/business_area_information/add.businessareainformation');
const fetchonecountryComponent = require('../../../../components/v1/admin/usersnew/business_area_information/fetch.one.businessareainformation');
const fetchAllcountryComponent = require('../../../../components/v1/admin/usersnew/business_area_information/fetch.businessareainformation');
const statusChangeComponent = require('../../../../components/v1/admin/usersnew/business_area_information/changestatus.businessareainformation');
const updatecountryComponent = require('../../../../components/v1/admin/usersnew/business_area_information/update.businessareainformation');
const deletecountryComponent = require('../../../../components/v1/admin/usersnew/business_area_information/delete.businessareainformation');



router.post('/add', adminMiddleware.checkAccess(), area_information);
router.delete('/:id', adminMiddleware.checkAccess(), deletecountryComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllcountryComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchonecountryComponent);
router.put('/update', adminMiddleware.checkAccess(), updatecountryComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);


module.exports = router;