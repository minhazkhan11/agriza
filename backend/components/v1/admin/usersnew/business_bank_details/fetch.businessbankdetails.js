'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Bankdetails = require('../../../../../models/be_bank_details');
const { constants } = require('../../../../../config');



module.exports = async (req, res, next) => {
  try {
    const bankdetails = await Bankdetails.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
    }).fetchAll({
      require: false,
      withRelated: [{
        'be_information_id': function (query) {
          query.select('id', 'business_name');
        }
      }]

    });


    if (!bankdetails)
      return res.serverError(400, 'invalid bank details');
    return res.success({ bankdetails });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};