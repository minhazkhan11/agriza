'use strict';

const { ErrorHandler} = require('../../../../../lib/utils');
const AdvisorEmail = require('../../../../../models/advisoremail');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.email;   

    // body.added_by = req.user.id;
   
    const email = await new AdvisorEmail(body).save();

    return res.success({ email });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};