'use strict';

const { ErrorHandler} = require('../../../../../lib/utils');
const State = require('../../../../../models/state');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.state;    

    const check = await State
    .query((qb) => {
      qb.where(function () {
        this.where('state_name', body.state_name)
      })
        .whereIn('active_status', ['active', 'inactive']);
    })
    .fetch({ require: false });

  if (check) {
    return res.serverError(500, ErrorHandler("all ready  state_name "));
  }

    body.added_by = req.user.id;
   
    const state = await new State(body).save();

    return res.success({ state });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};