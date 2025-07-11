'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const User = require('../../../../../models/users');
const Entitybasic = require('../../../../../models/be_information');
const Assigned = require('../../../../../models/assigned_to');
const passportMiddleWare = require('../../../../../middlewares/passport.middleware');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
    try {
        const phone = req.body.user.phone;
        const by = req.user?.id || null;
        const otp = req.body.user.otp;

        const sessionUserData = req.session?.userData;


        if (!sessionUserData) {
            return res.serverError(400, ErrorHandler("Session expired or invalid"));
        }

        if (sessionUserData.otpExpiration < Date.now()) {
            return res.serverError(400, ErrorHandler("OTP has expired"));
        }
        if (sessionUserData.otp != otp || sessionUserData.phone != phone) {
            return res.serverError(400, ErrorHandler("Invalid OTP"));
        }
        req.session.destroy();
        const newUser = await new User({
            phone: sessionUserData.phone,
            full_name: sessionUserData.full_name,
            password: sessionUserData.password,
            role: sessionUserData.role || "user",
            menu_plan_id: sessionUserData.menu_plan_id,
            added_by: by,
            active_status: constants.activeStatus.active,
        }).save();

        const entitybasic_data = await new Entitybasic({
            gst_number: sessionUserData.gst_number,
            pan_number: sessionUserData.pan_number,
            registerd_type: sessionUserData.registerd_type,
            business_name: sessionUserData.business_name,
            business_category_ids: JSON.stringify(sessionUserData.business_category_ids),
            module_id: 6,
            added_by: newUser.id
        }).save();

        await new Assigned({
            user_id: newUser.id,
            be_information_id: entitybasic_data.id,
            added_by: newUser.id
        }).save();

        const tokenData = await passportMiddleWare.generateSignUpToken(newUser.toJSON());

        return res.success({
            message: "OTP Verified Successfully",
            user: tokenData.user,
            token: tokenData.token,
            refresh_token: tokenData.refresh_token,
        });

    } catch (error) {
        if (error instanceof SyntaxError)
            return res.serverError(400, ErrorHandler('Invalid JSON format in the user body'));
        if (error.constraint === 'users_phone_unique')
            return res.serverError(400, ErrorHandler('Phone is already taken'));
        return res.serverError(500, ErrorHandler(error));
    }
};
