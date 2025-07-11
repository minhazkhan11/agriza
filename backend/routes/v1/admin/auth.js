const express = require('express');
const router = express.Router();
const joiMiddleware = require("../../../middlewares/joi.middleware");
const joiSchemas = require("../../../lib/utils/joi.schemas");
const adminMiddleware = require('../../../middlewares/admin.middleware');
const passportMiddleWare = require('../../../middlewares/passport.middleware');


const signinComponent = require('../../../components/v1/admin/master/auth/signin');
const changePasswordComponent = require('../../../components/v1/admin/master/auth/change.password.user');
const signinwithotpComponent = require('../../../components/v1/admin/master/auth/signin.with.otp');
const signinwithverifiedotpComponent = require('../../../components/v1/admin/master/auth/verified.signin.with.otp');
const userLoginAccessComponent = require('../../../components/v1/admin/master/auth/Access.login');
const userDetailsCheckComponent = require('../../../components/v1/admin/master/auth/check.details');


router.post(
  "/signin",
  joiMiddleware.joiBodyMiddleware(joiSchemas.signinUser, "user"),
  signinComponent
);

router.post(
  "/signinotp", signinwithotpComponent
);
router.post(
  "/verifiedotp", signinwithverifiedotpComponent
);
router.put("/changepassword",passportMiddleWare.jwtAuth, adminMiddleware.be_adminAccess(), changePasswordComponent);

router.post('/signin/user_access/:id',  userLoginAccessComponent);

router.get("/check/details", passportMiddleWare.jwtAuth, adminMiddleware.be_adminAccess(), userDetailsCheckComponent);


module.exports = router;
