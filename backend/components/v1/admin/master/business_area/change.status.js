'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Businessarea = require('../../../../../models/business_area');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.business_area.id;
        let Check = await Businessarea.where({ id }).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('Pin code not found'));

        const body = req.body.business_area;
        const business_area = await new Businessarea().where({ id }).save(body, {method: 'update'}); 
        
        return res.success({ business_area });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};