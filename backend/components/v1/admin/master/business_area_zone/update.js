'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Businessareazone = require('../../../../../models/business_area_zone');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.business_area_zone.id;
        let Check = await Businessareazone.where({ id}).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('business_area_zone not found'));

        const body = req.body.business_area_zone;
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
        const business_area_zone = await new Businessareazone().where({ id }).save(body, { method: 'update' });

        const newbusiness_area_teritari = await Businessareazone.where({ id }).fetch({ require: false });

        return res.success({ business_area_zone : newbusiness_area_teritari });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};