'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Lead_subCategory = require('../../../../../models/lead_sub_category');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.lead_sub_category.id;
        let Check = await Lead_subCategory.where({ id }).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('Lead_subCategory not found'));

        const body = req.body.lead_sub_category;
        const lead_sub_category = await new Lead_subCategory().where({ id }).save(body, {method: 'update'}); 
        
        return res.success({ lead_sub_category });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};