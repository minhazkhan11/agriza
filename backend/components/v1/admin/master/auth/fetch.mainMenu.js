'use strict';
const { ErrorHandler } = require('../../../../lib/utils');
const MainMenu = require('../../../../models/integratedModulesMainMenu');
const SubMenu = require('../../../../models/integratedModulesSubMenu');
const User = require('../../../../models/user');
const PlanPurchase = require('../../../../models/integratedModulesPlansPurchase');
const IntegratedModulePlans = require("../../../../models/integratedModulesPlans");
const constants = require('../../../../config/constants');
const moment = require('moment');
const { orderBy } = require('lodash');
module.exports = async (req, res, next) => {
    try {
        // Fetch existing user
        const user = await User.where({ id: req.user.id }).fetch({ require: false });
        if (!user)
            return res.serverError(422, ErrorHandler(new Error(constants.error.auth.userNotFound)));
        //
        const modulePlan = await IntegratedModulePlans.where({ coaching_menu_plan_id: user.toJSON().menu_plan_id }).fetch({ require: false });
        const existingPlan = await PlanPurchase.query()
            .where({ user_id: req.user.id, razorpay_payment_status: 'success' })
            .orderBy('id', 'desc') // Assuming 'id' is the primary key
            .first();
        const existingPlanJson = existingPlan;
        // Fetch main menu items for the user
        const mainMenuItems = await MainMenu.where({
            menu_plan_id: user.get('menu_plan_id'),
            active_status: 'active'
        })
            .orderBy('index_id', 'asc')
            .fetchAll({
                require: false,
                columns: ['id', 'name', 'type', 'icon', 'path', 'validity']
            });
        let menuArray = [];
        // Iterate through each main menu item
        for (const mainMenuItem of mainMenuItems) {
            let mainMenuJson = mainMenuItem.toJSON();
            mainMenuJson.page_status = true;
            // Fetch sub-menu items for the current main menu item
            const subMenuItems = await SubMenu.where({
                menu_id: mainMenuJson.id,
                active_status: 'active'
            })
                .orderBy('index_id', 'asc')
                .fetchAll({
                    require: false,
                    columns: ['id', 'name', 'type', 'path', 'validity']
                });
            // Iterate through each sub-menu item
            let subMenuArray = [];
            for (const subMenuItem of subMenuItems) {
                let subMenuJson = subMenuItem.toJSON();
                subMenuJson.page_status = true;
                // Check validity of sub-menu item based on user's plan
                if (existingPlanJson && subMenuJson.validity != 0) {
                    let effectiveDate = existingPlanJson.created_at;
                    effectiveDate = moment(effectiveDate).add(subMenuJson.validity, 'months').valueOf();
                    //  subMenuJson.effectiveDate = effectiveDate;
                    //subMenuJson.newDate = new Date().getTime();
                    subMenuJson.validity = effectiveDate > new Date().getTime();
                } else {
                    subMenuJson.validity = true;
                }
                subMenuArray.push(subMenuJson);
            }
            mainMenuJson.menu = subMenuArray;
            // Check validity of main menu item based on user's plan
            if (existingPlanJson && mainMenuJson.validity != 0) {
                let effectiveDate = existingPlanJson.created_at;
                effectiveDate = moment(effectiveDate).add(mainMenuJson.validity, 'months').valueOf();
                // mainMenuJson.effectiveDate = effectiveDate;
                // mainMenuJson.newDate = new Date().getTime();
                mainMenuJson.validity = effectiveDate > new Date().getTime();
            } else {
                mainMenuJson.validity = true;
            }
            if (mainMenuJson.type === 'link') {
                delete mainMenuJson.menu;
            }
            if (mainMenuJson.type === 'dropdown') {
                delete mainMenuJson.path;
            }
            menuArray.push(mainMenuJson);
        }
        const plan_name = modulePlan.toJSON().plan_name;
        const count = mainMenuItems.length;
        return res.success({
            menu: menuArray,
            plan_name,
            count
        });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};

















