'use strict';

const { ErrorHandler} = require('../../../../../lib/utils');
const District = require('../../../../../models/district');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.district;    

    const check = await District
    .query((qb) => {
      qb.where(function () {
        this.where('district_name', body.district_name)
      })
        .whereIn('active_status', ['active', 'inactive']);
    })
    .fetch({ require: false });

  if (check) {
    return res.serverError(500, ErrorHandler("all ready  district_name "));
  }

    body.added_by = req.user.id;
   
    const district = await new District(body).save();

    return res.success({ district });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};