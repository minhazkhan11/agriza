'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Rake = require('../../../../../models/rake');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.rake.id;
        let Check = await Rake.where({ id }).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('Rake not found'));

        const body = req.body.rake;
        const rake = await new Rake().where({ id }).save(body, {method: 'update'}); 
        
        return res.success({ rake });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};