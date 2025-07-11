


// "use strict";
// const { ErrorHandler } = require('../../../../../lib/utils');
// const User = require("../../../../../models/users");
// const { constants } = require("../../../../../config");
// const MainMenu = require("../../../../../models/integrated_modules_main_menu");
// const SubMenu = require('../../../../../models/integrated_modules_sub_menu');
// const ChildMenu = require('../../../../../models/integrated_modules_child_menu');
// const menu_paln = require("../../../../../models/menu_plan");

// module.exports = async (req, res, next) => {
//   try {
//     // Existing user fetch
//     const user = await User.where({ id: req.user.id }).fetch({ require: false });

//     if (!user) {
//       return res.serverError(422, ErrorHandler(new Error(constants.error.auth.userNotFound)));
//     }

//     const userPlan = await menu_paln.where({ id: user.get('menu_plan_id') }).fetch({ require: false });
//     const plan_name = userPlan ? userPlan.get('menu_name') : null;

//     // Fetch main menu items
//     const mainMenuItems = await MainMenu.where({
//       menu_plan_id: user.get('menu_plan_id'),
//       active_status: 'active'
//     })
//       .orderBy('index_id', 'asc')
//       .fetchAll({
//         require: false,
//         columns: ['id', 'name', 'type', 'icon', 'path']
//       });

//     let menuArray = [];

//     // Iterate through each main menu item
//     for (const mainMenuItem of mainMenuItems.toJSON()) {
//       let mainMenuJson = mainMenuItem;
//       mainMenuJson.page_status = true;

//       // Fetch sub-menu items
//       const subMenuItems = await SubMenu.where({
//         main_menu_id: mainMenuJson.id,
//         active_status: 'active'
//       })
//         .orderBy('index_id', 'asc')
//         .fetchAll({
//           require: false,
//           columns: ['id', 'name', 'type', 'path']
//         });

//       let subMenuArray = [];

//       for (const subMenuItem of subMenuItems.toJSON()) {
//         let subMenuJson = subMenuItem;
//         subMenuJson.page_status = true;

//         // Fetch child-menu items
//         const childMenuItems = await ChildMenu.where({
//           sub_menu_id: subMenuJson.id,
//           active_status: 'active'
//         })
//           .orderBy('index_id', 'asc')
//           .fetchAll({
//             require: false,
//             columns: ['id', 'name', 'type', 'path']
//           });

//         let childMenuArray = [];

//         for (const childMenuItem of childMenuItems.toJSON()) {
//           let childMenuJson = childMenuItem;
//           childMenuJson.page_status = true;
//           childMenuArray.push(childMenuJson);
//         }

//         subMenuJson.child_menu = childMenuArray;
//         subMenuArray.push(subMenuJson);
//       }

//       mainMenuJson.menu = subMenuArray;

//       // Validate menu type
//       if (mainMenuJson.type === 'link') {
//         delete mainMenuJson.menu;
//       }
//       if (mainMenuJson.type === 'dropdown') {
//         delete mainMenuJson.path;
//       }

//       menuArray.push(mainMenuJson);
//     }

//     const count = mainMenuItems.length;

//     return res.success({
//       menu: menuArray,
//       plan_name,
//       count
//     });

//   } catch (error) {
//     return res.serverError(500, ErrorHandler(error));
//   }
// };



// "use strict";
// const { ErrorHandler } = require('../../../../../lib/utils');
// const User = require("../../../../../models/users");
// const { constants } = require("../../../../../config");
// const MainMenu = require("../../../../../models/integrated_modules_main_menu");
// const SubMenu = require('../../../../../models/integrated_modules_sub_menu');
// const ChildMenu = require('../../../../../models/integrated_modules_child_menu');
// const menu_paln = require("../../../../../models/menu_plan");

// module.exports = async (req, res, next) => {
//   try {
//     // Existing user fetch
//     const user = await User.where({ id: req.user.id }).fetch({ require: false });

//     if (!user) {
//       return res.serverError(422, ErrorHandler(new Error(constants.error.auth.userNotFound)));
//     }

//     const userPlan = await menu_paln.where({ id: user.get('menu_plan_id') }).fetch({ require: false });
//     const plan_name = userPlan ? userPlan.get('menu_name') : null;

//     // Fetch main menu items
//     const mainMenuItems = await MainMenu.where({
//       menu_plan_id: user.get('menu_plan_id'),
//       active_status: 'active'
//     })
//       .orderBy('index_id', 'asc')
//       .fetchAll({
//         require: false,
//         columns: ['id', 'index_id', 'name', 'type', 'icon', 'path', 'actions']
//       });

//     let menuArray = [];

//     // Iterate through each main menu item
//     for (const mainMenuItem of mainMenuItems.toJSON()) {
//       let mainMenuJson = mainMenuItem;
//       mainMenuJson.page_status = true;

//       // Fetch sub-menu items
//       const subMenuItems = await SubMenu.where({
//         main_menu_id: mainMenuJson.id,
//         active_status: 'active'
//       })
//         .orderBy('index_id', 'asc')
//         .fetchAll({
//           require: false,
//           columns: ['id', 'index_id', 'name', 'type', 'path', 'actions']
//         });

//       let subMenuArray = [];

//       for (const subMenuItem of subMenuItems.toJSON()) {
//         let subMenuJson = subMenuItem;
//         subMenuJson.page_status = true;

//         // Fetch child-menu items
//         const childMenuItems = await ChildMenu.where({
//           sub_menu_id: subMenuJson.id,
//           active_status: 'active'
//         })
//           .orderBy('index_id', 'asc')
//           .fetchAll({
//             require: false,
//             columns: ['id', 'index_id', 'name', 'type', 'path', 'actions']
//           });

//         let childMenuArray = [];

//         for (const childMenuItem of childMenuItems.toJSON()) {
//           let childMenuJson = childMenuItem;
//           childMenuJson.page_status = true;
//           childMenuArray.push(childMenuJson);
//         }

//         subMenuJson.child_menu = childMenuArray;
//         subMenuArray.push(subMenuJson);
//       }

//       mainMenuJson.menu = subMenuArray;

//       // Validate menu type
//       if (mainMenuJson.type === 'link') {
//         delete mainMenuJson.menu;
//       }
//       if (mainMenuJson.type === 'dropdown') {
//         delete mainMenuJson.path;
//       }

//       menuArray.push(mainMenuJson);
//     }

//     const count = mainMenuItems.length;

//     return res.success({
//       menu: menuArray,
//       plan_name,
//       count
//     });

//   } catch (error) {
//     return res.serverError(500, ErrorHandler(error));
//   }
// };
"use strict";
const { ErrorHandler } = require('../../../../../lib/utils');
const User = require("../../../../../models/users");
const { constants } = require("../../../../../config");
const MainMenu = require("../../../../../models/integrated_modules_main_menu");
const SubMenu = require('../../../../../models/integrated_modules_sub_menu');
const ChildMenu = require('../../../../../models/integrated_modules_child_menu');
const menu_plan = require("../../../../../models/menu_plan");

const hasValidActions = (actions) => {
  if (!actions) return false;
  return Object.values(actions).some(Boolean);
};

module.exports = async (req, res, next) => {
  try {
    const user = await User.where({ id: req.user.id }).fetch({ require: false });
    if (!user) {
      return res.serverError(422, ErrorHandler(new Error(constants.error.auth.userNotFound)));
    }

    const userPlan = await menu_plan.where({ id: user.get('menu_plan_id') }).fetch({ require: false });
    const plan_name = userPlan ? userPlan.get('menu_name') : null;

    const mainMenuItems = await MainMenu.where({
      menu_plan_id: user.get('menu_plan_id'),
      active_status: 'active'
    })
      .orderBy('index_id', 'asc')
      .fetchAll({
        require: false,
        columns: ['id', 'index_id', 'name', 'type', 'icon', 'path', 'actions']
      });

    let menuArray = [];

    for (const mainMenuItem of mainMenuItems.toJSON()) {
      let mainMenuJson = mainMenuItem;
      let subMenuArray = [];

      const subMenuItems = await SubMenu.where({
        main_menu_id: mainMenuJson.id,
        active_status: 'active'
      })
        .orderBy('index_id', 'asc')
        .fetchAll({
          require: false,
          columns: ['id', 'index_id', 'name', 'type', 'path', 'actions']
        });

      for (const subMenuItem of subMenuItems.toJSON()) {
        let subMenuJson = subMenuItem;
        let childMenuArray = [];

        const childMenuItems = await ChildMenu.where({
          sub_menu_id: subMenuJson.id,
          active_status: 'active'
        })
          .orderBy('index_id', 'asc')
          .fetchAll({
            require: false,
            columns: ['id', 'index_id', 'name', 'type', 'path', 'actions']
          });

        for (const childMenuItem of childMenuItems.toJSON()) {
          if (hasValidActions(childMenuItem.actions)) {
            childMenuArray.push({ ...childMenuItem, page_status: true });
          }
        }

        const includeSub =
          hasValidActions(subMenuJson.actions) || childMenuArray.length > 0;

        if (includeSub) {
          subMenuJson.page_status = true;
          subMenuJson.child_menu = childMenuArray;
          subMenuArray.push(subMenuJson);
        }
      }

      const includeMain =
        hasValidActions(mainMenuJson.actions) || subMenuArray.length > 0;

      if (includeMain) {
        mainMenuJson.page_status = true;
        mainMenuJson.menu = subMenuArray;

        if (mainMenuJson.type === 'link') delete mainMenuJson.menu;
        if (mainMenuJson.type === 'dropdown') delete mainMenuJson.path;

        menuArray.push(mainMenuJson);
      }
    }

    return res.success({
      menu: menuArray,
      plan_name,
      count: menuArray.length
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
