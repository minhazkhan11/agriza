'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const MainMenu = require('../../../../../models/integrated_modules_main_menu');
const Submenu = require('../../../../../models/integrated_modules_sub_menu');
const Childmenu = require('../../../../../models/integrated_modules_child_menu');

module.exports = async (req, res) => {
  try {
    console.log("LOG 1: Handler started");
    let { menu_plan_id, menu } = req.body;

    console.log("LOG 2:", { menu_plan_id, menu });

    if (!menu_plan_id) {
      console.log("LOG 3: Missing menu_plan_id");
      return res.serverError(400, ErrorHandler("Missing required field: menu_plan_id"));
    }

    if (!Array.isArray(menu) || menu.length === 0) {
      console.log("LOG 4: Invalid menu array");
      return res.serverError(400, ErrorHandler("menu must be a non-empty array"));
    }

    let addedMenus = [];
    console.log("LOG 5: Starting loop over menu items");

    for (let i = 0; i < menu.length; i++) {
      let menuItem = menu[i];
      console.log(`LOG 6.${i}: Processing menu item`, menuItem);

      if (!menuItem.menu_id || !menuItem.menu_type || !menuItem.actions) {
        console.log(`LOG 7.${i}: Missing menu_id/menu_type/actions`);
        return res.serverError(400, ErrorHandler("Each menu item must have menu_id, menu_type, and actions"));
      }

      if (menuItem.menu_type === "main") {
        console.log(`LOG 8.${i}: Processing main menu`);

        const existingMenu = await MainMenu.where({ id: menuItem.menu_id }).fetch({ require: false });
        console.log(`LOG 9.${i}: Fetched existingMenu`, existingMenu?.toJSON());

        const updateexistingMenu = existingMenu
          ? await MainMenu.where({
            name: existingMenu.get('name'),
            menu_plan_id: menu_plan_id
          }).fetch({ require: false })
          : null;
        console.log(`LOG 10.${i}: updateexistingMenu`, updateexistingMenu?.toJSON());

        if (updateexistingMenu) {
          await updateexistingMenu.save(
            { actions: menuItem.actions || updateexistingMenu.get('actions') },
            { patch: true }
          );
          addedMenus.push(updateexistingMenu);
          console.log(`LOG 11.${i}: Updated existing main menu`);
        } else {
          let newMenuData = existingMenu
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
          addedMenus.push(savedMenu);
          console.log(`LOG 12.${i}: Created new main menu`, savedMenu.toJSON());
        }
      }

      else if (menuItem.menu_type === "sub") {
        console.log(`LOG 13.${i}: Processing sub menu`);

        const existingSubMenu = await Submenu.where({ id: menuItem.menu_id }).fetch({ require: false });
        if (!existingSubMenu) {
          console.log(`LOG 14.${i}: Invalid submenu_id`);
          return res.serverError(400, ErrorHandler(`Invalid submenu_id: ${menuItem.menu_id}`));
        }

        let mainMenuId = menuItem.main_menu_id || existingSubMenu.get('main_menu_id');
        const existingMainMenu = await MainMenu.where({ id: mainMenuId }).fetch({ require: false });
        if (!existingMainMenu) {
          console.log(`LOG 15.${i}: Invalid main_menu_id`);
          return res.serverError(400, ErrorHandler(`Invalid main_menu_id: ${mainMenuId}`));
        }

        const mainMenuName = existingMainMenu.get('name');
        let existingMenuPlan = await MainMenu.where({
          name: mainMenuName,
          menu_plan_id: menu_plan_id
        }).fetch({ require: false });

        let newMainMenuId;

        if (existingMenuPlan) {
          await existingMenuPlan.save(
            { actions: JSON.stringify(menuItem.actions) || existingMenuPlan.get('actions') },
            { patch: true }
          );
          newMainMenuId = existingMenuPlan.get('id');
          addedMenus.push(existingMenuPlan);
          console.log(`LOG 16.${i}: Updated main menu for submenu`);
        } else {
          let newMainMenuData = {
            name: mainMenuName,
            type: existingMainMenu.get('type'),
            icon: existingMainMenu.get('icon'),
            path: existingMainMenu.get('path'),
            index_id: existingMainMenu.get('index_id'),
            menu_plan_id: menu_plan_id,
            actions: JSON.stringify(menuItem.actions)
          };

          const newMainMenu = await new MainMenu(newMainMenuData).save();
          newMainMenuId = newMainMenu.get('id');
          addedMenus.push(newMainMenu);
          console.log(`LOG 17.${i}: Created main menu for submenu`);
        }

        let existingSubMenuPlan = await Submenu.where({
          name: existingSubMenu.get('name'),
          main_menu_id: newMainMenuId
        }).fetch({ require: false });

        if (existingSubMenuPlan) {
          await existingSubMenuPlan.save(
            { actions: JSON.stringify(menuItem.actions) || existingSubMenuPlan.get('actions') },
            { patch: true }
          );
          addedMenus.push(existingSubMenuPlan);
          console.log(`LOG 18.${i}: Updated submenu`);
        } else {
          let newSubMenu = {
            name: existingSubMenu.get('name'),
            type: existingSubMenu.get('type'),
            icon: existingSubMenu.get('icon'),
            path: existingSubMenu.get('path'),
            index_id: existingSubMenu.get('index_id'),
            main_menu_id: newMainMenuId,
            actions: JSON.stringify(menuItem.actions)
          };

          const savedSubMenu = await new Submenu(newSubMenu).save();
          addedMenus.push(savedSubMenu);
          console.log(`LOG 19.${i}: Created new submenu`);
        }
      }

      if (menuItem.menu_type === "child") {
        console.log(`LOG 20.${i}: Processing child menu`);

        const existingChildMenu = await Childmenu.where({ id: menuItem.menu_id }).fetch({ require: false });
        if (!existingChildMenu) {
          console.log(`LOG 21.${i}: Invalid childmenu_id`);
          return res.serverError(400, ErrorHandler(`Invalid childmenu_id: ${menuItem.menu_id}`));
        }

        let subMenuId = existingChildMenu.get('sub_menu_id');
        const existingSubMenu = await Submenu.where({ id: subMenuId }).fetch({ require: false });
        if (!existingSubMenu) {
          console.log(`LOG 22.${i}: Invalid sub_menu_id`);
          return res.serverError(400, ErrorHandler(`Invalid sub_menu_id: ${subMenuId}`));
        }

        let mainMenuId = existingSubMenu.get('main_menu_id');
        const existingMainMenu = await MainMenu.where({ id: mainMenuId }).fetch({ require: false });
        if (!existingMainMenu) {
          console.log(`LOG 23.${i}: Invalid main_menu_id`);
          return res.serverError(400, ErrorHandler(`Invalid main_menu_id: ${mainMenuId}`));
        }

        let existingMenuPlan = await MainMenu.where({
          menu_plan_id: menu_plan_id,
          name: existingMainMenu.get('name')
        }).fetch({ require: false });

        let newMainMenuId;

        if (existingMenuPlan) {
          await existingMenuPlan.save(
            { actions: JSON.stringify(menuItem.actions) || existingMenuPlan.get('actions') },
            { patch: true }
          );
          newMainMenuId = existingMenuPlan.get('id');
          addedMenus.push(existingMenuPlan);
          console.log(`LOG 24.${i}: Updated main menu for child`);
        } else {
          let newMainMenuData = {
            name: existingMainMenu.get('name'),
            type: existingMainMenu.get('type'),
            icon: existingMainMenu.get('icon'),
            path: existingMainMenu.get('path'),
            index_id: existingMainMenu.get('index_id'),
            menu_plan_id: menu_plan_id,
            actions: JSON.stringify(menuItem.actions)
          };

          const newMainMenu = await new MainMenu(newMainMenuData).save();
          newMainMenuId = newMainMenu.get('id');
          addedMenus.push(newMainMenu);
          console.log(`LOG 25.${i}: Created main menu for child`);
        }

        let existingSubMenuPlan = await Submenu.where({
          main_menu_id: newMainMenuId,
          name: existingSubMenu.get('name')
        }).fetch({ require: false });

        let newSubMenuId;

        if (existingSubMenuPlan) {
          await existingSubMenuPlan.save(
            { actions: JSON.stringify(menuItem.actions) || existingSubMenuPlan.get('actions') },
            { patch: true }
          );
          newSubMenuId = existingSubMenuPlan.get('id');
          addedMenus.push(existingSubMenuPlan);
          console.log(`LOG 26.${i}: Updated submenu for child`);
        } else {
          let newSubMenuData = {
            name: existingSubMenu.get('name'),
            type: existingSubMenu.get('type'),
            icon: existingSubMenu.get('icon'),
            path: existingSubMenu.get('path'),
            index_id: existingSubMenu.get('index_id'),
            main_menu_id: newMainMenuId,
            actions: JSON.stringify(menuItem.actions)
          };

          const newSavedSubMenu = await new Submenu(newSubMenuData).save();
          newSubMenuId = newSavedSubMenu.get('id');
          addedMenus.push(newSavedSubMenu);
          console.log(`LOG 27.${i}: Created submenu for child`);
        }

        let existingChildMenuPlan = await Childmenu.where({
          sub_menu_id: newSubMenuId,
          name: existingChildMenu.get('name')
        }).fetch({ require: false });

        if (existingChildMenuPlan) {
          // Handling duplicates: Option to skip or update
          console.log(`LOG 30.${i}: Duplicate child menu entry for ${existingChildMenu.get('name')} with sub_menu_id ${newSubMenuId}`);
          return res.serverError(400, ErrorHandler(`Duplicate child menu entry: ${existingChildMenu.get('name')} with sub_menu_id ${newSubMenuId}`));
        } else {
          let newChildMenuData = {
            name: existingChildMenu.get('name'),
            type: existingChildMenu.get('type'),
            icon: existingChildMenu.get('icon'),
            path: existingChildMenu.get('path'),
            index_id: existingChildMenu.get('index_id'),
            sub_menu_id: newSubMenuId,
            actions: JSON.stringify(menuItem.actions)
          };

          try {
            const savedChildMenu = await new Childmenu(newChildMenuData).save();
            addedMenus.push(savedChildMenu);
            console.log(`LOG 29.${i}: Created new child menu`);
          } catch (error) {
            console.error(`LOG 31.${i}: Error creating child menu`, error);
            return res.serverError(500, ErrorHandler('An error occurred while creating the child menu'));
          }
        }
      }

    }

    console.log("LOG 30: Menu update complete");
    return res.success({
      message: "New menu items added successfully!",
      added_menus: addedMenus
    });

  } catch (error) {
    console.log("LOG 31: Error caught", error);
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
