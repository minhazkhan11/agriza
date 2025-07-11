const express = require('express');
const router = express.Router();
const joiMiddleware = require('../../../../middlewares/joi.middleware');
const joiSchemas = require('../../../../lib/utils/joi.schemas');
const adminMiddleware = require('../../../../middlewares/admin.middleware');

const bank_details = require('../../../../components/v1/admin/usersnew/business_bank_details/add.businessbankdetails');
const deletecountryComponent = require('../../../../components/v1/admin/usersnew/business_bank_details/delete.businessbankdetails');
const fetchAllcountryComponent = require('../../../../components/v1/admin/usersnew/business_bank_details/fetch.businessbankdetails');
const fetchonecountryComponent = require('../../../../components/v1/admin/usersnew/business_bank_details/fetch.one.businessbankdetails');
const updatecountryComponent = require('../../../../components/v1/admin/usersnew/business_bank_details/update.businessbankdetails');
const statusChangeComponent = require('../../../../components/v1/admin/usersnew/business_bank_details/changestatus.businessbankdetails');



router.post('/add', adminMiddleware.checkAccess(), bank_details);
router.delete('/:id', adminMiddleware.checkAccess(), deletecountryComponent);
router.get('/', adminMiddleware.checkAccess(), fetchAllcountryComponent);
router.get('/:id', adminMiddleware.checkAccess(), fetchonecountryComponent);
router.put('/update', adminMiddleware.checkAccess(), updatecountryComponent);
router.put('/status', adminMiddleware.checkAccess(), statusChangeComponent);


module.exports = router;