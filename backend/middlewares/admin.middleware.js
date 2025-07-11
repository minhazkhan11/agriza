const constants = require('../config/constants');
const { ErrorHandler } = require('../lib/utils');
const User = require("../models/users");
const MainMenu = require("../models/integrated_modules_main_menu");
const SubMenu = require("../models/integrated_modules_sub_menu");
const ChildMenu = require("../models/integrated_modules_child_menu");
const pathMapping = require("./pathMapping");


module.exports.adminAccess = () => {
    return async (req, res, next) => {
        const userRole = req.user.role;
        if (userRole === 'superadmin') {
            next();
        } else {
            return res.serverError(400, ErrorHandler(new Error(constants.error.accessDenied)));
        }
    };
};

module.exports.be_adminAccess = () => {
    return async (req, res, next) => {
        const userRole = req.user.role;
        if (userRole === 'admin' || "superadmin") {
            next();
        } else {
            return res.serverError(400, ErrorHandler(new Error(constants.error.accessDenied)));
        }
    };
};




module.exports.checkAccess = () => {
    return async (req, res, next) => {
        try {


            const user = await User.where({ id: req.user.id }).fetch({ require: false });

            if (!user) {
                console.log("User");
                return res.status(401).json({ success: false, message: "User not found" });
            }

            const menuPlanId = user.get("menu_plan_id");
            if (!menuPlanId) {
                return res.status(403).json({ success: false, message: "Access Denied" });
            }
            const methodToAction = {
                GET: "view",
                POST: "add",
                PUT: "edit",
                DELETE: "delete"
            };

            const actionType = methodToAction[req.method];
            if (!actionType) {
                console.log(` Invalid Request: ${req.method} not allowed`);
                return res.status(405).json({ success: false, message: "Invalid request method" });
            }
            if (actionType === "view") {
                console.log("GET request, access granted by default.");
                return next();
            }

            console.log(` Checking Access for ${actionType}, Menu Plan ID: ${menuPlanId}`);

            const mainMenuItems = await MainMenu.where({
                menu_plan_id: menuPlanId,
                active_status: "active"
            }).fetchAll({ require: false });

            let menuPermissions = {};

            for (const mainMenuItem of mainMenuItems.toJSON()) {
                menuPermissions[mainMenuItem.path] = mainMenuItem.actions;

                const subMenuItems = await SubMenu.where({
                    main_menu_id: mainMenuItem.id,
                    active_status: "active"
                }).fetchAll({ require: false });

                for (const subMenuItem of subMenuItems.toJSON()) {
                    menuPermissions[subMenuItem.path] = subMenuItem.actions;

                    const childMenuItems = await ChildMenu.where({
                        sub_menu_id: subMenuItem.id,
                        active_status: "active"
                    }).fetchAll({ require: false });

                    for (const childMenuItem of childMenuItems.toJSON()) {
                        menuPermissions[childMenuItem.path] = childMenuItem.actions;
                    }
                }
            }

            let requestPath = req.baseUrl + req.path;
            requestPath = requestPath.replace(/\/$/, ""); // Remove trailing slash

            let matchedMenuPath = Object.keys(pathMapping).find(menuPath =>
                requestPath.startsWith(menuPath) // Match all routes under a base path
            ) || requestPath;

            matchedMenuPath = pathMapping[matchedMenuPath] || matchedMenuPath;

            console.log(` Mapped Menu Path: ${matchedMenuPath}`);
            console.log(" DEBUG: Menu Permissions:", JSON.stringify(menuPermissions, null, 2));


            // if (!menuPermissions[matchedMenuPath] || menuPermissions[matchedMenuPath][actionType] !== true) {
            //     console.log("Access Denied! User does not have permission for", actionType);
            //     return res.status(403).json({
            //         success: false,
            //         message: "Access Denied. You do not have permission to perform this action."
            //     });
            // }

            // Convert matchedMenuPath to array if it’s mapped to multiple paths
            const pathsToCheck = Array.isArray(matchedMenuPath) ? matchedMenuPath : [matchedMenuPath];

            const hasPermission = pathsToCheck.some(path => {
                return menuPermissions[path] && menuPermissions[path][actionType] === true;
            });

            if (!hasPermission) {
                console.log("Access Denied! User does not have permission for", actionType);
                return res.status(403).json({
                    success: false,
                    message: "Access Denied. You do not have permission to perform this action."
                });
            }


            console.log(" Access Granted");
            next();
        } catch (error) {
            console.log(" Error in Middleware", error);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    };
};
