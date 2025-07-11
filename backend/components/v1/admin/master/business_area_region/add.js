'use strict';

const { ErrorHandler} = require('../../../../../lib/utils');
const Businessarearegion = require('../../../../../models/business_area_region');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.business_area_region;    

    body.added_by = req.user.id;
    if (typeof body === "string") {
      body = JSON.parse(body);
    }
// Ensure demographic fields are properly formatted as JSON
    if (body.area_ids) {
      try {
        body.area_ids = JSON.stringify(body.area_ids);
      } catch (e) {
        return res.badRequest({ error: "Invalid JSON format in area_ids" });
      }
    }
   
    const business_area_region = await new Businessarearegion(body).save();

    return res.success({ business_area_region });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};