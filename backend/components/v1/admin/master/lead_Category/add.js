'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Lead_Category = require('../../../../../models/lead_category');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.lead_category;
    
    body.added_by = req.user.id;

    const lead_category = await new Lead_Category(body).save();

    return res.success({ lead_category });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};