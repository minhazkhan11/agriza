const express = require('express');
const router = express.Router();
const adminMiddleware = require('../../../../middlewares/admin.middleware');



// const addComponent = require('../../../../components/v1/admin/website/signup.website');
const signupsendotpComponent = require('../../../../components/v1/admin/website/users_website/signup.sendotp');
const signupverifiedotpComponent = require('../../../../components/v1/admin/website/users_website/verified.otp');
const forgetpasswordComponent = require('../../../../components/v1/admin/website/users_website/forget.password')
const updatepasswordComponent = require('../../../../components/v1/admin/website/users_website/update.password')
const resendotpComponent = require('../../../../components/v1/admin/website/users_website/resend.otp')



// router.post('/signup', adminMiddleware.adminAccess(), addComponent);
router.post('/signup', signupsendotpComponent);
router.put('/verifiedotp', signupverifiedotpComponent);
router.put('/forgetpassword', forgetpasswordComponent);
router.put('/updatepassword', updatepasswordComponent);
router.put('/resendotp', resendotpComponent);
// router.get('/:id', adminMiddleware.be_adminAccess(), fetchoneComponent);
// router.get('/marketers_id/:id', adminMiddleware.be_adminAccess(), fetchbyMarketersIdComponent);
// router.put('/update', adminMiddleware.adminAccess(), updateComponent);
// router.put('/status', adminMiddleware.adminAccess(), statusChangeComponent);


module.exports = router;