'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const District = require('../../../../../models/district');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.district.id;
        let Check = await District.where({ id}).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('District not found'));

        const body = req.body.district;
        const district = await new District().where({ id }).save(body, { method: 'update' });

        const newDistrict = await District.where({ id }).fetch({ require: false });

        return res.success({ district : newDistrict });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};