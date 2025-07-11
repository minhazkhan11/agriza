'use strict';

const { ErrorHandler} = require('../../../../../lib/utils');
const Businessareazone = require('../../../../../models/business_area_zone');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.business_area_zone;    
    if (typeof body === "string") {
      body = JSON.parse(body);
    }
// Ensure demographic fields are properly formatted as JSON
    if (body.region_ids) {
      try {
        body.region_ids = JSON.stringify(body.region_ids);
      } catch (e) {
        return res.badRequest({ error: "Invalid JSON format in region_ids" });
      }
    }
    body.added_by = req.user.id;
   
    const business_area_zone = await new Businessareazone(body).save();

    return res.success({ business_area_zone });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};