'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Menu = require('../../../../../models/menu_plan');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const menu_plan = await Menu.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ id: req.params.id })
        .andWhere('added_by', userId)
        .orderBy('created_at', 'asc');
    }).fetch({
      require: false
    });

    if (!menu_plan)
      return res.serverError(400, 'invalid menu_plan name');
    return res.success({ menu_plan });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
