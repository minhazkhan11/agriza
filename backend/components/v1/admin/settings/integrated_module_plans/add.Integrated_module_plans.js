'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Integratedplans = require('../../../../../models/integrated_module_plans');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.integrated_menu_plans;

    const check = await Integratedplans
      .query((qb) => {
        qb.where('plan_name', body.plan_name)
          .andWhere('added_by', req.user.id)
          .whereIn('active_status', ['active', 'inactive']);
      })
      .fetch({ require: false });
    if (check) {
      return res.serverError(500, ErrorHandler("all ready plan_name exist "));
    }

    body.added_by = req.user.id;

    const integrated_menu_plans = await new Integratedplans(body).save();

    return res.success({ integrated_menu_plans });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};