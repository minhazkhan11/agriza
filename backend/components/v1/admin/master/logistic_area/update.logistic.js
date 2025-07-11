'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Logistic = require('../../../../../models/logistic_area');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        const id = req.body.logistic_area?.id;
        if (!id) return res.serverError(400, ErrorHandler('Missing logistic_area ID'));

        // Fetch logistic_area to check existence
        let logisticArea = await Logistic.where({ id }).fetch({ require: false });
        if (!logisticArea) {
            return res.serverError(400, ErrorHandler('Data not found'));
        }

        let body = req.body.logistic_area;
        
        // Parse body if it's a string
        if (typeof body === 'string') {
            try {
                body = JSON.parse(body);
            } catch (error) {
                return res.serverError(400, ErrorHandler('Invalid JSON format in request body'));
            }
        }

        if (typeof body !== 'object' || Array.isArray(body)) {
            return res.serverError(400, ErrorHandler('Request body must be an object'));
        }

        // Ensure demographic fields are properly formatted as JSON
    if (body.demographic_includes_id) {
        try {
          body.demographic_includes_id = JSON.stringify(body.demographic_includes_id);
        } catch (e) {
          return res.badRequest({ error: "Invalid JSON format in demographic_includes_id" });
        }
      }
        // Update logistic_area
        await Logistic.where({ id }).save(body, { patch: true });

        // Fetch updated record
        const updatedLogisticArea = await Logistic.where({ id }).fetch({ require: false });

        return res.success({ logistic_area: updatedLogisticArea });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
