'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Category = require('../../../../../models/business_category');
const { constants } = require('../../../../../config');


module.exports = async (req, res, next) => {
    try {
        // Get array of category IDs and the updated data from the request body
        const { ids, active_status } = req.body.category;

        // Check if ids or active_status are not provided or empty
        if (!ids || !active_status || ids.length === 0) {
            return res.serverError(400, ErrorHandler('category IDs or active_status not provided or empty'));
        }

        // Fetch category based on the provided IDs
        const categoryToUpdate = await Category.where('id', 'in', ids).fetchAll({ require: false });

        // Check if all requested category exist
        if (categoryToUpdate.length !== ids.length) {
            return res.serverError(400, ErrorHandler('One or more category not found'));
        }

        let status;
        if (active_status === 'active') {
            status = 'activated';
        }
        if (active_status === 'inactive') {
            status = 'inactivated';
        }
        if (active_status === 'deleted') {
            status = 'deleted';
        }

        // Update each category with the provided data
        await Promise.all(categoryToUpdate.map(async category => {
            await category.save({ active_status }, { method: 'update' });
        }));

        return res.success({ message: `Category has been successfully ${status}.` });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
