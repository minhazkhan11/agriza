
'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const MainMenu = require('../../../../../models/integrated_modules_main_menu');
const Submenu = require('../../../../../models/integrated_modules_sub_menu');
const Childmenu = require('../../../../../models/integrated_modules_child_menu');


// module.exports = async (req, res) => {
//   try {
//     let { menu_plan_id, menu } = req.body;

//     if (!menu_plan_id) {
//       return res.serverError(400, ErrorHandler("Missing required field: menu_plan_id"));
//     }

//     if (!Array.isArray(menu) || menu.length === 0) {
//       return res.serverError(400, ErrorHandler("menu must be a non-empty array"));
//     }

//     let addedMenus = [];

//     for (let menuItem of menu) {
//       if (!menuItem.menu_id || !menuItem.menu_type || !menuItem.actions) {
//         return res.serverError(400, ErrorHandler("Each menu item must have menu_id, menu_type, and actions"));
//       }

//       if (menuItem.menu_type === "main") {

//         const existingMenu = await MainMenu.where({ id: menuItem.menu_id }).fetch({ require: false });

//         if (!existingMenu) {
//           console.log("No menu found with given menu_id, creating a new menu...");
//         } else {
//           console.log("Found menu:", existingMenu.toJSON());
//         }

//         const updateexistingMenu = existingMenu
//           ? await MainMenu.where({
//             name: existingMenu.get('name'),
//             menu_plan_id: menu_plan_id
//           }).fetch({ require: false })
//           : null;

//         if (updateexistingMenu) {
//           await updateexistingMenu.save(
//             { actions: menuItem.actions || updateexistingMenu.get('actions') },
//             { patch: true }
//           );
//           addedMenus.push(updateexistingMenu);
//         } else {
//           let newMenuData = existingMenu
//             ? {
//               name: existingMenu.get('name'),
//               type: existingMenu.get('type'),
//               icon: existingMenu.get('icon'),
//               path: existingMenu.get('path'),
//               index_id: existingMenu.get('index_id'),
//               menu_plan_id: menu_plan_id,
//               actions: menuItem.actions
//             }
//             : {
//               name: menuItem.name,
//               type: menuItem.type,
//               icon: menuItem.icon,
//               path: menuItem.path,
//               index_id: menuItem.index_id,
//               menu_plan_id: menu_plan_id,
//               actions: menuItem.actions
//             };

//           const savedMenu = await new MainMenu(newMenuData).save();
//           addedMenus.push(savedMenu);
//         }
//       }

//       if (menuItem.menu_type === "sub") {
//         const existingSubMenu = await Submenu.where({ id: menuItem.menu_id }).fetch({ require: false });

//         if (!existingSubMenu) {
//           return res.serverError(400, ErrorHandler(`Invalid submenu_id: ${menuItem.menu_id}`));
//         }

//         let mainMenuId = menuItem.main_menu_id || existingSubMenu.get('main_menu_id');
//         const existingMainMenu = await MainMenu.where({ id: mainMenuId }).fetch({ require: false });

//         if (!existingMainMenu) {
//           return res.serverError(400, ErrorHandler(`Invalid main_menu_id: ${mainMenuId}`));
//         }

//         const mainMenuName = existingMainMenu.get('name');

//         let existingMenuPlan = await MainMenu.where({
//           name: mainMenuName,
//           menu_plan_id: menu_plan_id
//         }).fetch({ require: false });

//         let newMainMenuId;

//         if (existingMenuPlan) {

//           await existingMenuPlan.save(
//             { actions: menuItem.actions || existingMenuPlan.get('actions') },
//             { patch: true }
//           );

//           newMainMenuId = existingMenuPlan.get('id');
//           addedMenus.push(existingMenuPlan);
//         } else {
//           let newMainMenuData = {
//             name: mainMenuName,
//             type: existingMainMenu.get('type'),
//             icon: existingMainMenu.get('icon'),
//             path: existingMainMenu.get('path'),
//             index_id: existingMainMenu.get('index_id'),
//             menu_plan_id: menu_plan_id,
//             actions: menuItem.actions
//           };

//           const newMainMenu = await new MainMenu(newMainMenuData).save();
//           newMainMenuId = newMainMenu.get('id');
//           addedMenus.push(newMainMenu);
//         }

//         let existingSubMenuPlan = await Submenu.where({
//           name: existingSubMenu.get('name'),
//           main_menu_id: newMainMenuId
//         }).fetch({ require: false });

//         if (existingSubMenuPlan) {
//           await existingSubMenuPlan.save(
//             { actions: menuItem.actions || existingSubMenuPlan.get('actions') },
//             { patch: true }
//           );
//           addedMenus.push(existingSubMenuPlan);
//         } else {
//           let newSubMenu = {
//             name: existingSubMenu.get('name'),
//             type: existingSubMenu.get('type'),
//             icon: existingSubMenu.get('icon'),
//             path: existingSubMenu.get('path'),
//             index_id: existingSubMenu.get('index_id'),
//             main_menu_id: newMainMenuId,
//             actions: menuItem.actions
//           };

//           const savedSubMenu = await new Submenu(newSubMenu).save();
//           addedMenus.push(savedSubMenu);
//         }
//       }

//       else if (menuItem.menu_type === "child") {
//         const existingChildMenu = await Childmenu.where({ id: menuItem.menu_id }).fetch({ require: false });

//         if (!existingChildMenu) {
//           return res.serverError(400, ErrorHandler(`Invalid childmenu_id: ${menuItem.menu_id}`));
//         }

//         let subMenuId = existingChildMenu.get('sub_menu_id');
//         const existingSubMenu = await Submenu.where({ id: subMenuId }).fetch({ require: false });

//         if (!existingSubMenu) {
//           return res.serverError(400, ErrorHandler(`Invalid sub_menu_id: ${subMenuId}`));
//         }

//         let mainMenuId = existingSubMenu.get('main_menu_id');
//         const existingMainMenu = await MainMenu.where({ id: mainMenuId }).fetch({ require: false });

//         if (!existingMainMenu) {
//           return res.serverError(400, ErrorHandler(`Invalid main_menu_id: ${mainMenuId}`));
//         }

//         let existingMenuPlan = await MainMenu.where({
//           menu_plan_id: menu_plan_id,
//           name: existingMainMenu.get('name')
//         }).fetch({ require: false });

//         let newMainMenuId;

//         if (existingMenuPlan) {
//           await existingMenuPlan.save(
//             { actions: menuItem.actions || existingMenuPlan.get('actions') },
//             { patch: true }
//           );
//           newMainMenuId = existingMenuPlan.get('id');
//           addedMenus.push(existingMenuPlan);
//         } else {
//           let newMainMenuData = {
//             name: existingMainMenu.get('name'),
//             type: existingMainMenu.get('type'),
//             icon: existingMainMenu.get('icon'),
//             path: existingMainMenu.get('path'),
//             index_id: existingMainMenu.get('index_id'),
//             menu_plan_id: menu_plan_id,
//             actions: menuItem.actions
//           };

//           const newMainMenu = await new MainMenu(newMainMenuData).save();
//           newMainMenuId = newMainMenu.get('id');
//           addedMenus.push(newMainMenu);
//         }

//         let existingSubMenuPlan = await Submenu.where({
//           main_menu_id: newMainMenuId,
//           name: existingSubMenu.get('name')
//         }).fetch({ require: false });

//         let newSubMenuId;

//         if (existingSubMenuPlan) {
//           await existingSubMenuPlan.save(
//             { actions: menuItem.actions || existingSubMenuPlan.get('actions') },
//             { patch: true }
//           );
//           newSubMenuId = existingSubMenuPlan.get('id');
//           addedMenus.push(existingSubMenuPlan);
//         } else {
//           let newSubMenuData = {
//             name: existingSubMenu.get('name'),
//             type: existingSubMenu.get('type'),
//             icon: existingSubMenu.get('icon'),
//             path: existingSubMenu.get('path'),
//             index_id: existingSubMenu.get('index_id'),
//             main_menu_id: newMainMenuId,
//             actions: menuItem.actions
//           };

//           const newSavedSubMenu = await new Submenu(newSubMenuData).save();
//           newSubMenuId = newSavedSubMenu.get('id');
//           addedMenus.push(newSavedSubMenu);
//         }

//         let existingChildMenuPlan = await Childmenu.where({
//           sub_menu_id: newSubMenuId,
//           name: existingChildMenu.get('name')
//         }).fetch({ require: false });

//         if (existingChildMenuPlan) {
//           await existingChildMenuPlan.save(
//             { actions: menuItem.actions || existingChildMenuPlan.get('actions') },
//             { patch: true }
//           );
//           addedMenus.push(existingChildMenuPlan);
//         } else {
//           let newChildMenuData = {
//             name: existingChildMenu.get('name'),
//             type: existingChildMenu.get('type'),
//             icon: existingChildMenu.get('icon'),
//             path: existingChildMenu.get('path'),
//             index_id: existingChildMenu.get('index_id'),
//             sub_menu_id: newSubMenuId,
//             actions: menuItem.actions
//           };

//           const savedChildMenu = await new Childmenu(newChildMenuData).save();
//           addedMenus.push(savedChildMenu);
//         }
//       }
//     }

//     return res.success({
//       message: "New menu items added successfully!",
//       added_menus: addedMenus
//     });

//   } catch (error) {
//     return res.serverError(500, { error: ErrorHandler(error) });
//   }
// };

function mergeActions(actionsList) {
  const merged = {};

  actionsList.forEach(actions => {
    for (let key in actions) {
      merged[key] = merged[key] || actions[key];
    }
  });

  return merged;
}


module.exports = async (req, res) => {
  try {
    let { menu_plan_id, menu } = req.body;

    if (!menu_plan_id) {
      return res.serverError(400, ErrorHandler("Missing required field: menu_plan_id"));
    }

    if (!Array.isArray(menu) || menu.length === 0) {
      return res.serverError(400, ErrorHandler("menu must be a non-empty array"));
    }

    let addedMenus = [];

    for (let menuItem of menu) {
      if (!menuItem.menu_id || !menuItem.menu_type || !menuItem.actions) {
        return res.serverError(400, ErrorHandler("Each menu item must have menu_id, menu_type, and actions"));
      }
      if (menuItem.menu_type === "main") {
        const existingMenu = await MainMenu.where({ id: menuItem.menu_id }).fetch({ require: false });

        if (!existingMenu) {
          console.log("No menu found with given menu_id, creating a new menu...");
        } else {
          console.log("Found menu:", existingMenu.toJSON());
        }

        const updateexistingMenu = existingMenu
          ? await MainMenu.where({
            name: existingMenu.get('name'),
            menu_plan_id: menu_plan_id
          }).fetch({ require: false })
          : null;

        let newMainMenuId;

        if (updateexistingMenu) {
          await updateexistingMenu.save(
            { actions: menuItem.actions || updateexistingMenu.get('actions') },
            { patch: true }
          );
          newMainMenuId = updateexistingMenu.get('id');
          addedMenus.push(updateexistingMenu);
        } else {
          const newMenuData = existingMenu
            ? {
              name: existingMenu.get('name'),
              type: existingMenu.get('type'),
              icon: existingMenu.get('icon'),
              path: existingMenu.get('path'),
              index_id: existingMenu.get('index_id'),
              menu_plan_id: menu_plan_id,
              actions: menuItem.actions
            }
            : {
              name: menuItem.name,
              type: menuItem.type,
              icon: menuItem.icon,
              path: menuItem.path,
              index_id: menuItem.index_id,
              menu_plan_id: menu_plan_id,
              actions: menuItem.actions
            };

          const savedMenu = await new MainMenu(newMenuData).save();
          newMainMenuId = savedMenu.get('id');
          addedMenus.push(savedMenu);
        }

        // 🔁 Recalculate Main Menu Actions by merging all its submenus
        const allSubmenus = await Submenu.where({ main_menu_id: newMainMenuId }).fetchAll({ require: false });

        if (allSubmenus && allSubmenus.length > 0) {
          const subActionsList = allSubmenus.toJSON().map(sub => sub.actions || {});
          const mergedMainActions = mergeActions(subActionsList);

          await MainMenu.where({ id: newMainMenuId }).save({ actions: mergedMainActions }, { patch: true });
        }
      }


      if (menuItem.menu_type === "sub") {
        const existingSubMenu = await Submenu.where({ id: menuItem.menu_id }).fetch({ require: false });

        if (!existingSubMenu) {
          return res.serverError(400, ErrorHandler(`Invalid submenu_id: ${menuItem.menu_id}`));
        }

        let mainMenuId = menuItem.main_menu_id || existingSubMenu.get('main_menu_id');
        const existingMainMenu = await MainMenu.where({ id: mainMenuId }).fetch({ require: false });

        if (!existingMainMenu) {
          return res.serverError(400, ErrorHandler(`Invalid main_menu_id: ${mainMenuId}`));
        }

        const mainMenuName = existingMainMenu.get('name');

        // Step 1: Create or update Main Menu
        let existingMenuPlan = await MainMenu.where({
          name: mainMenuName,
          menu_plan_id: menu_plan_id
        }).fetch({ require: false });

        let newMainMenuId;

        if (existingMenuPlan) {
          // Don't overwrite actions blindly
          const currentActions = existingMenuPlan.get('actions') || {};
          const newActions = menuItem.actions || {};
          const mergedActions = mergeActions([currentActions, newActions]);

          await existingMenuPlan.save({ actions: mergedActions }, { patch: true });

          newMainMenuId = existingMenuPlan.get('id');
          addedMenus.push(existingMenuPlan);
        } else {
          const newMainMenuData = {
            name: mainMenuName,
            type: existingMainMenu.get('type'),
            icon: existingMainMenu.get('icon'),
            path: existingMainMenu.get('path'),
            index_id: existingMainMenu.get('index_id'),
            menu_plan_id: menu_plan_id,
            actions: menuItem.actions
          };

          const newMainMenu = await new MainMenu(newMainMenuData).save();
          newMainMenuId = newMainMenu.get('id');
          addedMenus.push(newMainMenu);
        }

        // Step 2: Create or update Sub Menu
        let existingSubMenuPlan = await Submenu.where({
          name: existingSubMenu.get('name'),
          main_menu_id: newMainMenuId
        }).fetch({ require: false });

        let newSubMenuId;

        if (existingSubMenuPlan) {
          const currentSubActions = existingSubMenuPlan.get('actions') || {};
          const newSubActions = menuItem.actions || {};
          const mergedSubActions = mergeActions([currentSubActions, newSubActions]);

          await existingSubMenuPlan.save({ actions: mergedSubActions }, { patch: true });
          newSubMenuId = existingSubMenuPlan.get('id');
          addedMenus.push(existingSubMenuPlan);
        } else {
          const newSubMenu = await new Submenu({
            name: existingSubMenu.get('name'),
            type: existingSubMenu.get('type'),
            icon: existingSubMenu.get('icon'),
            path: existingSubMenu.get('path'),
            index_id: existingSubMenu.get('index_id'),
            main_menu_id: newMainMenuId,
            actions: menuItem.actions
          }).save();

          newSubMenuId = newSubMenu.get('id');
          addedMenus.push(newSubMenu);
        }

        // Step 3: Merge children actions into submenu
        const allChildren = await Childmenu.where({ sub_menu_id: newSubMenuId }).fetchAll({ require: false });
        let mergedSubActions = {};

        if (allChildren && allChildren.length > 0) {
          const childActionsList = allChildren.toJSON().map(child => child.actions || {});
          mergedSubActions = mergeActions(childActionsList);
        } else {
          const currentSub = await Submenu.where({ id: newSubMenuId }).fetch({ require: false });
          mergedSubActions = currentSub?.get('actions') || {};
        }

        await Submenu.where({ id: newSubMenuId }).save({ actions: mergedSubActions }, { patch: true });

        // Step 4: Merge submenu actions into main menu
        const allSubs = await Submenu.where({ main_menu_id: newMainMenuId }).fetchAll({ require: false });
        let mergedMainActions = {};

        if (allSubs && allSubs.length > 0) {
          const subActionsList = allSubs.toJSON().map(sub => sub.actions || {});
          mergedMainActions = mergeActions(subActionsList);
        } else {
          const currentMain = await MainMenu.where({ id: newMainMenuId }).fetch({ require: false });
          mergedMainActions = currentMain?.get('actions') || {};
        }

        await MainMenu.where({ id: newMainMenuId }).save({ actions: mergedMainActions }, { patch: true });
      }



      else if (menuItem.menu_type === "child") {
        const existingChildMenu = await Childmenu.where({ id: menuItem.menu_id }).fetch({ require: false });

        if (!existingChildMenu) {
          return res.serverError(400, ErrorHandler(`Invalid childmenu_id: ${menuItem.menu_id}`));
        }

        const subMenuId = existingChildMenu.get('sub_menu_id');
        const existingSubMenu = await Submenu.where({ id: subMenuId }).fetch({ require: false });

        if (!existingSubMenu) {
          return res.serverError(400, ErrorHandler(`Invalid sub_menu_id: ${subMenuId}`));
        }

        const mainMenuId = existingSubMenu.get('main_menu_id');
        const existingMainMenu = await MainMenu.where({ id: mainMenuId }).fetch({ require: false });

        if (!existingMainMenu) {
          return res.serverError(400, ErrorHandler(`Invalid main_menu_id: ${mainMenuId}`));
        }

        // ===== Main Menu =====
        let existingMainMenuPlan = await MainMenu.where({
          menu_plan_id: menu_plan_id,
          name: existingMainMenu.get('name'),
        }).fetch({ require: false });

        let newMainMenuId;

        if (existingMainMenuPlan) {
          newMainMenuId = existingMainMenuPlan.get('id');
          addedMenus.push(existingMainMenuPlan);
        } else {
          const newMainMenu = await new MainMenu({
            name: existingMainMenu.get('name'),
            type: existingMainMenu.get('type'),
            icon: existingMainMenu.get('icon'),
            path: existingMainMenu.get('path'),
            index_id: existingMainMenu.get('index_id'),
            menu_plan_id: menu_plan_id,
            actions: menuItem.actions,
          }).save();
          newMainMenuId = newMainMenu.get('id');
          addedMenus.push(newMainMenu);
        }

        // ===== Sub Menu =====
        let existingSubMenuPlan = await Submenu.where({
          main_menu_id: newMainMenuId,
          name: existingSubMenu.get('name'),
        }).fetch({ require: false });

        let newSubMenuId;

        if (existingSubMenuPlan) {
          newSubMenuId = existingSubMenuPlan.get('id');
          addedMenus.push(existingSubMenuPlan);
        } else {
          const newSubMenu = await new Submenu({
            name: existingSubMenu.get('name'),
            type: existingSubMenu.get('type'),
            icon: existingSubMenu.get('icon'),
            path: existingSubMenu.get('path'),
            index_id: existingSubMenu.get('index_id'),
            main_menu_id: newMainMenuId,
            actions: menuItem.actions,
          }).save();
          newSubMenuId = newSubMenu.get('id');
          addedMenus.push(newSubMenu);
        }

        // ===== Child Menu =====
        let existingChildMenuPlan = await Childmenu.where({
          sub_menu_id: newSubMenuId,
          name: existingChildMenu.get('name'),
        }).fetch({ require: false });

        if (existingChildMenuPlan) {
          await existingChildMenuPlan.save({ actions: menuItem.actions }, { patch: true });
          addedMenus.push(existingChildMenuPlan);
        } else {
          const newChildMenu = await new Childmenu({
            name: existingChildMenu.get('name'),
            type: existingChildMenu.get('type'),
            icon: existingChildMenu.get('icon'),
            path: existingChildMenu.get('path'),
            index_id: existingChildMenu.get('index_id'),
            sub_menu_id: newSubMenuId,
            actions: menuItem.actions,
          }).save();
          addedMenus.push(newChildMenu);
        }

        // ===== Merge Submenu Actions from All Child Menus =====
        const siblingChildren = await Childmenu.where({ sub_menu_id: newSubMenuId }).fetchAll({ require: false });
        const childActionsList = siblingChildren.toJSON().map(child => child.actions || {});
        const mergedSubActions = mergeActions(childActionsList);

        await Submenu.where({ id: newSubMenuId }).save({ actions: mergedSubActions }, { patch: true });

        // ===== Merge Main Menu Actions from All Submenus =====
        const siblingSubMenus = await Submenu.where({ main_menu_id: newMainMenuId }).fetchAll({ require: false });
        const subActionsList = siblingSubMenus.toJSON().map(sub => sub.actions || {});
        const mergedMainActions = mergeActions(subActionsList);

        await MainMenu.where({ id: newMainMenuId }).save({ actions: mergedMainActions }, { patch: true });
      }
    }

    return res.success({
      message: "New menu items added successfully!",
      added_menus: addedMenus
    });

  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
