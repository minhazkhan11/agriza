'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Menu = require('../../../../../models/menu_plan');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.menu_plan;

    const check = await Menu
      .query((qb) => {
        qb.where(function () {
          this.where('menu_name', body.menu_name)
            .andWhere('added_by', req.user.id)
        })
          .whereIn('active_status', ['active', 'inactive']);
      })
      .fetch({ require: false });

    if (check) {
      return res.serverError(500, ErrorHandler("all ready menu_name exist "));
    }

    body.added_by = req.user.id;

    const menu_plan = await new Menu(body).save();

    return res.success({ menu_plan });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};