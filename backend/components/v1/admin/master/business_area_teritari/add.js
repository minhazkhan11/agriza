'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Businessareateritary = require('../../../../../models/business_area_teritari');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.business_area_teritari;

    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    body.added_by = req.user.id;

    // Ensure demographic fields are properly formatted as JSON
    if (body.demographic_include_id) {
      try {
        body.demographic_include_id = JSON.stringify(body.demographic_include_id);
      } catch (e) {
        return res.badRequest({ error: "Invalid JSON format in demographic_includes_id" });
      }
    }

    if (body.demographic_exclude_id) {
      try {
        body.demographic_exclude_id = JSON.stringify(body.demographic_exclude_id);
      } catch (e) {
        return res.badRequest({ error: "Invalid JSON format in demographic_excludes_id" });
      }
    }
    if (body.demographic_exclude_2_id) {
      try {
        body.demographic_exclude_2_id = JSON.stringify(body.demographic_exclude_2_id);
      } catch (e) {
        return res.badRequest({ error: "Invalid JSON format in demographic_exclude_2_id" });
      }
    }

    const business_area_teritari = await new Businessareateritary(body).save();

    return res.success({ business_area_teritari });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};