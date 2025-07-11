'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Businessarea = require('../../../../../models/business_area');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.business_area.id;
        let Check = await Businessarea.where({ id}).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('business_area not found'));

        const body = req.body.business_area;

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
        const business_area = await new Businessarea().where({ id }).save(body, { method: 'update' });

        const newbusiness_area_teritari = await Businessarea.where({ id }).fetch({ require: false });

        return res.success({ business_area : newbusiness_area_teritari });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};