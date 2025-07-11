'use strict';

const { ErrorHandler} = require('../../../../../lib/utils');
const Businessarea = require('../../../../../models/business_area');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.business_area; 

    if (typeof body === "string") {
      body = JSON.parse(body);
    }
// Ensure demographic fields are properly formatted as JSON
    if (body.teritari_ids) {
      try {
        body.teritari_ids = JSON.stringify(body.teritari_ids);
      } catch (e) {
        return res.badRequest({ error: "Invalid JSON format in teritari_ids" });
      }
    }

    body.added_by = req.user.id;
   
    const business_area = await new Businessarea(body).save();

    return res.success({ business_area });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};