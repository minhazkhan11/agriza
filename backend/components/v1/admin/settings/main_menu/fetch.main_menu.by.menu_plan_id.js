
const { ErrorHandler } = require('../../../../../lib/utils');
const User = require("../../../../../models/users");
const { constants } = require("../../../../../config");
const MainMenu = require("../../../../../models/integrated_modules_main_menu");
const SubMenu = require('../../../../../models/integrated_modules_sub_menu');
const ChildMenu = require('../../../../../models/integrated_modules_child_menu');

module.exports = async (req, res, next) => {
  try {
    const mainMenuItems = await MainMenu.query(qb => {
      qb.whereIn('active_status', ['active', 'inactive'])
        .andWhere({ menu_plan_id: req.params.menu_plan_id })
        .orderBy('index_id', 'asc');
    }).fetchAll({ require: false });

    let menuArray = [];

    for (const mainMenuItem of mainMenuItems.toJSON()) {
      if (mainMenuItem.type !== 'dropdown') {
        menuArray.push({
          menu_id: mainMenuItem.id,
          index_id: mainMenuItem.index_id,
          name: mainMenuItem.name,
          menu_type: "main",
          icon: mainMenuItem.icon,
          add: mainMenuItem.actions.add,
          path: mainMenuItem.path,
          edit: mainMenuItem.actions.edit,
          view: mainMenuItem.actions.view,
          delete: mainMenuItem.actions.delete,
          page_status: true
        });
      }

      const subMenuItems = await SubMenu.where({
        main_menu_id: mainMenuItem.id,
        active_status: 'active'
      })
        .orderBy('index_id', 'asc')
        .fetchAll({ require: false });

      for (const subMenuItem of subMenuItems.toJSON()) {
        if (subMenuItem.type !== 'dropdown') {
          menuArray.push({
            menu_id: subMenuItem.id,
            index_id: subMenuItem.index_id,
            name: subMenuItem.name,
            menu_type: "sub",
            path: subMenuItem.path,
            add: subMenuItem.actions.add,
            edit: subMenuItem.actions.edit,
            view: subMenuItem.actions.view,
            delete: subMenuItem.actions.delete,
            page_status: true
          });
        }

        const childMenuItems = await ChildMenu.where({
          sub_menu_id: subMenuItem.id,
          active_status: 'active'
        })
          .orderBy('index_id', 'asc')
          .fetchAll({ require: false });

        for (const childMenuItem of childMenuItems.toJSON()) {
          menuArray.push({
            menu_id: childMenuItem.id,
            index_id: childMenuItem.index_id,
            name: childMenuItem.name,
            menu_type: "child",
            path: childMenuItem.path,
            add: childMenuItem.actions.add,
            edit: childMenuItem.actions.edit,
            view: childMenuItem.actions.view,
            delete: childMenuItem.actions.delete,
            page_status: true
          });
        }
      }
    }

    return res.success({
      success: true,
      menu: menuArray // JSON array return ho raha hai bina indexed keys ke
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
