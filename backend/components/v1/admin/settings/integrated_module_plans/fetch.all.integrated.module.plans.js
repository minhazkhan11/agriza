

'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Integratedmoduleplans = require('../../../../../models/integrated_module_plans');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const integrated_module_plans = await Integratedmoduleplans.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active])
        .select('id', 'plan_name')
    }).fetchAll({
      require: false,

    });


    if (!integrated_module_plans)
      return res.serverError(400, 'invalid integrated_module_plans');
    return res.success({ integrated_module_plans });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
