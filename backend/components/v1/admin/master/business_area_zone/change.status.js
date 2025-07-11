'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Businessareazone = require('../../../../../models/business_area_zone');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.business_area_zone.id;
        let Check = await Businessareazone.where({ id }).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('Pin code not found'));

        const body = req.body.business_area_zone;
        const business_area_zone = await new Businessareazone().where({ id }).save(body, {method: 'update'}); 
        
        return res.success({ business_area_zone });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};