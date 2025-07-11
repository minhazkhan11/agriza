'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Rakepoint = require('../../../../../models/rakepoint');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.rakepoint.id;
        let Check = await Rakepoint.where({ id }).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('Rakepoint code not found'));

        const body = req.body.rakepoint;
        const rakepoint = await new Rakepoint().where({ id }).save(body, {method: 'update'}); 
        
        return res.success({ rakepoint });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};