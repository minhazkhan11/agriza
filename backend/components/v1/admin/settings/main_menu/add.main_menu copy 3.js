'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const MainMenu = require('../../../../../models/integrated_modules_main_menu');
const Submenu = require('../../../../../models/integrated_modules_sub_menu');
const Childmenu = require('../../../../../models/integrated_modules_child_menu');

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

    const findOrCreateMainMenu = async (existingMainMenu, actions) => {
      const mainMenuName = existingMainMenu.get('name');
      let menuPlan = await MainMenu.where({ name: mainMenuName, menu_plan_id }).fetch({ require: false });

      if (menuPlan) {
        await menuPlan.save(
          { actions: actions || menuPlan.get('actions') },
          { patch: true }
        );
      } else {
        menuPlan = await new MainMenu({
          name: mainMenuName,
          type: existingMainMenu.get('type'),
          icon: existingMainMenu.get('icon'),
          path: existingMainMenu.get('path'),
          index_id: existingMainMenu.get('index_id'),
          menu_plan_id,
          actions
        }).save();
      }

      addedMenus.push(menuPlan);
      return menuPlan.get('id');
    };

    const findOrCreateSubMenu = async (existingSubMenu, mainMenuId, actions) => {
      let submenuPlan = await Submenu.where({
        name: existingSubMenu.get('name'),
        main_menu_id: mainMenuId
      }).fetch({ require: false });

      if (submenuPlan) {
        await submenuPlan.save(
          { actions: actions || submenuPlan.get('actions') },
          { patch: true }
        );
      } else {
        submenuPlan = await new Submenu({
          name: existingSubMenu.get('name'),
          type: existingSubMenu.get('type'),
          icon: existingSubMenu.get('icon'),
          path: existingSubMenu.get('path'),
          index_id: existingSubMenu.get('index_id'),
          main_menu_id: mainMenuId,
          actions
        }).save();
      }

      addedMenus.push(submenuPlan);
      return submenuPlan.get('id');
    };

    const findOrCreateChildMenu = async (existingChildMenu, subMenuId, actions) => {
      let childMenuPlan = await Childmenu.where({
        name: existingChildMenu.get('name'),
        sub_menu_id: subMenuId
      }).fetch({ require: false });

      if (childMenuPlan) {
        await childMenuPlan.save(
          { actions: actions || childMenuPlan.get('actions') },
          { patch: true }
        );
      } else {
        childMenuPlan = await new Childmenu({
          name: existingChildMenu.get('name'),
          type: existingChildMenu.get('type'),
          icon: existingChildMenu.get('icon'),
          path: existingChildMenu.get('path'),
          index_id: existingChildMenu.get('index_id'),
          sub_menu_id: subMenuId,
          actions
        }).save();
      }

      addedMenus.push(childMenuPlan);
    };

    for (let menuItem of menu) {
      if (!menuItem.menu_id || !menuItem.menu_type || !menuItem.actions) {
        return res.serverError(400, ErrorHandler("Each menu item must have menu_id, menu_type, and actions"));
      }

      let actions = JSON.stringify(menuItem.actions);

      if (menuItem.menu_type === 'main') {
        const existingMenu = await MainMenu.where({ id: menuItem.menu_id }).fetch({ require: false });
        if (!existingMenu) {
          console.log("No main menu found with given menu_id, skipping...");
          continue;
        }
        await findOrCreateMainMenu(existingMenu, actions);

      } else if (menuItem.menu_type === 'sub') {
        const existingSubMenu = await Submenu.where({ id: menuItem.menu_id }).fetch({ require: false });
        if (!existingSubMenu) {
          return res.serverError(400, ErrorHandler(`Invalid submenu_id: ${menuItem.menu_id}`));
        }

        let existingMainMenu = await MainMenu.where({ id: existingSubMenu.get('main_menu_id') }).fetch({ require: false });
        if (!existingMainMenu) {
          return res.serverError(400, ErrorHandler(`Invalid main_menu_id: ${existingSubMenu.get('main_menu_id')}`));
        }

        const newMainMenuId = await findOrCreateMainMenu(existingMainMenu, actions);
        await findOrCreateSubMenu(existingSubMenu, newMainMenuId, actions);

      } else if (menuItem.menu_type === 'child') {
        const existingChildMenu = await Childmenu.where({ id: menuItem.menu_id }).fetch({ require: false });
        if (!existingChildMenu) {
          return res.serverError(400, ErrorHandler(`Invalid childmenu_id: ${menuItem.menu_id}`));
        }

        const existingSubMenu = await Submenu.where({ id: existingChildMenu.get('sub_menu_id') }).fetch({ require: false });
        if (!existingSubMenu) {
          return res.serverError(400, ErrorHandler(`Invalid sub_menu_id: ${existingChildMenu.get('sub_menu_id')}`));
        }

        const existingMainMenu = await MainMenu.where({ id: existingSubMenu.get('main_menu_id') }).fetch({ require: false });
        if (!existingMainMenu) {
          return res.serverError(400, ErrorHandler(`Invalid main_menu_id: ${existingSubMenu.get('main_menu_id')}`));
        }

        const newMainMenuId = await findOrCreateMainMenu(existingMainMenu, actions);
        const newSubMenuId = await findOrCreateSubMenu(existingSubMenu, newMainMenuId, actions);
        await findOrCreateChildMenu(existingChildMenu, newSubMenuId, actions);

      } else {
        return res.serverError(400, ErrorHandler("Invalid menu_type. Must be 'main', 'sub', or 'child'"));
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
