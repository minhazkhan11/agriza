
'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Businessinformation = require('../../../../../models/be_area_information');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const business_information = await Businessinformation.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ id: req.params.id })
    }).fetch({
      require: false,
    });


    if (!business_information)
      return res.serverError(400, 'invalid business_information');
    return res.success({ business_information });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
