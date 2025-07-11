'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Lead_subCategory = require('../../../../../models/lead_sub_category');
const { constants } = require('../../../../../config');
module.exports = async (req, res, next) => {
    try {
        //Get logged in user
        let check = await Lead_subCategory.where({ id: req.params.id }).fetch({ require: false });
        if (!check)
            return res.serverError(400, ErrorHandler(new Error(' lead_sub_category not found')));        
        await new Lead_subCategory().where({ id: req.params.id }).save({ active_status: constants.activeStatus.deleted }, { method: 'update'})
        .then(() => {
            return res.success({'message': ' lead_sub_category deleted successfully'});
        })
        .catch(err => {
            return res.serverError(400, ErrorHandler('Something went wrong'));
        })
    } catch (error) {
        console.log('errorrr',error);
        return res.serverError(500, ErrorHandler(error));
    }
};
