'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Lead_Category = require('../../../../../models/lead_category');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.lead_category.id;
        let Check = await Lead_Category.where({ id}).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('Lead_Category not found'));

        const body = req.body.lead_category;
        const lead_category = await new Lead_Category().where({ id }).save(body, { method: 'update' });

        const newLead_Category = await Lead_Category.where({ id }).fetch({ require: false });

        return res.success({ lead_category : newLead_Category });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};