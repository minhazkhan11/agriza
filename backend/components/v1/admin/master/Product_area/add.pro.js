'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const ProArea = require('../../../../../models/product_area');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.product_area;

    if (typeof body === "string") {
      body = JSON.parse(body);
    }

    body.added_by = req.user.id;

    // Ensure demographic fields are properly formatted as JSON
    if (body.demographic_includes_id) {
      try {
        body.demographic_includes_id = JSON.stringify(body.demographic_includes_id);
      } catch (e) {
        return res.badRequest({ error: "Invalid JSON format in demographic_includes_id" });
      }
    }

    if (body.demographic_excludes_id) {
      try {
        body.demographic_excludes_id = JSON.stringify(body.demographic_excludes_id);
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

    const product_area = await new ProArea(body).save();

    return res.success({ product_area });

  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
