'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Tehsil = require('../../../../../models/tehsil');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.tehsil.id;
        let Check = await Tehsil.where({ id }).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('Tehsil not found'));

        const body = req.body.tehsil;
        const tehsil = await new Tehsil().where({ id }).save(body, {method: 'update'}); 
        
        return res.success({ tehsil });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};