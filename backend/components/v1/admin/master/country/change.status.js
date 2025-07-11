'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Country = require('../../../../../models/country');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.country.id;
        let Check = await Country.where({ id }).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('Country not found'));

        const body = req.body.country;
        const country = await new Country().where({ id }).save(body, {method: 'update'}); 
        
        return res.success({ country });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};