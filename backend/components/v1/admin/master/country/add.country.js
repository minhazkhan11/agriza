'use strict';

const { ErrorHandler} = require('../../../../../lib/utils');
const Country = require('../../../../../models/country');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.country;    

    const check = await Country
    .query((qb) => {
      qb.where(function () {
        this.where('country_name', body.country_name)
      })
        .whereIn('active_status', ['active', 'inactive']);
    })
    .fetch({ require: false });

  if (check) {
    return res.serverError(500, ErrorHandler("all ready country name"));
  }

    body.added_by = req.user.id;
   
    const country = await new Country(body).save();

    return res.success({ country });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};