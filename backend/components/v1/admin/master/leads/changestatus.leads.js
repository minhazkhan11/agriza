'use strict';


const { ErrorHandler } = require('../../../../../lib/utils');
const Lead = require('../../../../../models/lead');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {

    const id = req.body.lead.id;
    let Check = await Lead.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler(' Lead details not found'));

    const body = req.body.lead ;
    const lead  = await new Lead().where({ id }).save(body, { method: 'update' });

    return res.success({ lead  });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};