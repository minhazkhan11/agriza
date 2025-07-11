'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const ProArea = require('../../../../../models/product_area');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.product_area.id;
        let Check = await ProArea.where({ id }).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('Pin code not found'));

        const body = req.body.product_area;
        const product_area = await new ProArea().where({ id }).save(body, {method: 'update'}); 
        
        return res.success({ product_area });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};