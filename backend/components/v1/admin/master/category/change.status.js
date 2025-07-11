'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Category = require('../../../../../models/business_category');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.category.id;
        let Check = await Category.where({ id }).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('Category not found'));

        const body = req.body.category;
        const category = await new Category().where({ id }).save(body, {method: 'update'}); 
        
        return res.success({ category });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};