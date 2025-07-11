'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Pin = require('../../../../../models/pin');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.pin.id;
        let Check = await Pin.where({ id }).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('Pin code not found'));

        const body = req.body.pin;
        const pin = await new Pin().where({ id }).save(body, {method: 'update'}); 
        
        return res.success({ pin });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};