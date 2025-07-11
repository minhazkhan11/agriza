'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Units = require('../../../../../models/units');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.units.id;
        let Check = await Units.where({ id}).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('Units not found'));

        const body = req.body.units;
        const units = await new Units().where({ id }).save(body, { method: 'update' });

        const newUnits = await Units.where({ id }).fetch({ require: false });

        return res.success({ units : newUnits });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};