'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Logistic = require('../../../../../models/logistic_area');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.logistic_area.id;
        let Check = await Logistic.where({ id }).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('logistic_area not found'));

        const body = req.body.logistic_area;
        const logistic_area = await new Logistic().where({ id }).save(body, {method: 'update'}); 
        
        return res.success({ logistic_area });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};