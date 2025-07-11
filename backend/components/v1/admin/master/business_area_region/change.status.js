'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Businessarearegion = require('../../../../../models/business_area_region');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.business_area_region.id;
        let Check = await Businessarearegion.where({ id }).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('Pin code not found'));

        const body = req.body.business_area_region;
        const business_area_region = await new Businessarearegion().where({ id }).save(body, {method: 'update'}); 
        
        return res.success({ business_area_region });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};