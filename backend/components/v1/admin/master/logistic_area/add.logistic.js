'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Logistic = require('../../../../../models/logistic_area');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.logistic_area;

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


    const logistic_area = await new Logistic(body).save();

    return res.success({ logistic_area });

  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
