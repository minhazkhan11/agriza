'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Businessarearegion = require('../../../../../models/business_area_region');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.business_area_region.id;
        let Check = await Businessarearegion.where({ id}).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('business_area_region not found'));

        const body = req.body.business_area_region;

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
        const business_area_region = await new Businessarearegion().where({ id }).save(body, { method: 'update' });

        const newbusiness_area_teritari = await Businessarearegion.where({ id }).fetch({ require: false });

        return res.success({ business_area_region : newbusiness_area_teritari });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};