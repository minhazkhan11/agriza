'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Businessareateritary = require('../../../../../models/business_area_teritari');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.business_area_teritari.id;
        let Check = await Businessareateritary.where({ id }).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('Pin code not found'));

        const body = req.body.business_area_teritari;
        const business_area_teritari = await new Businessareateritary().where({ id }).save(body, {method: 'update'}); 
        
        return res.success({ business_area_teritari });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};