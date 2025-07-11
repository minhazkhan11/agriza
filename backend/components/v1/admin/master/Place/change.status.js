'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Place = require('../../../../../models/place');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.place.id;
        let Check = await Place.where({ id }).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler(' place_name not found'));

        const body = req.body.place;
        const place = await new Place().where({ id }).save(body, {method: 'update'}); 
        
        return res.success({ place });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};