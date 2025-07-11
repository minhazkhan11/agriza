'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Unit = require('../../../../../models/units');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.units.id;
        let Check = await Unit.where({ id }).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('Unit not found'));

        const body = req.body.units;
        const unit = await new Unit().where({ id }).save(body, {method: 'update'}); 
        
        return res.success({ unit });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};