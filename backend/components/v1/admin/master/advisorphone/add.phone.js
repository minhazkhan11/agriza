'use strict';

const { ErrorHandler} = require('../../../../../lib/utils');
const AdvisorPhone = require('../../../../../models/advisorphone');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.phone;    
    // body.added_by = req.user.id;
   
    const phone = await new AdvisorPhone(body).save();

    return res.success({ phone });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};