'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Attributes = require('../../../../../models/attributes');
const Variants = require('../../../../../models/variant');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.attributes.id;
        let Check = await Attributes.where({ id }).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('Attributes not found'));

        const body = req.body.attributes;
        const attributes = await new Attributes().where({ id }).save(body, {method: 'update'}); 
        
        return res.success({ attributes });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};