'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Menu = require('../../../../../models/menu_plan');
const { constants } = require('../../../../../config');


module.exports = async (req, res, next) => {
  try {

    const id = req.body.menu_plan.id;
    let Check = await Menu.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler('menu_plan not found'));

    const body = req.body.menu_plan;
    const menu_plan = await new Menu().where({ id }).save(body, { method: 'update' });

    const newmenu_plan = await Menu.where({ id }).fetch({ require: false });

    return res.success({ menu_plan: newmenu_plan });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};