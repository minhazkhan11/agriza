'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Attributes = require('../../../../../models/attributes');
const Variants = require('../../../../../models/variant');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        //Get logged in user
        let check = await Attributes.where({ id: req.params.id }).fetch({ require: false });
        if (!check)
            return res.serverError(400, ErrorHandler(new Error(' attributes not found')));        
        await new Attributes().where({ id: req.params.id }).save({ active_status: constants.activeStatus.deleted }, { method: 'update'})
        .then(() => {
            return res.success({'message': ' attributes deleted successfully'});
        })
        .catch(err => {
            return res.serverError(400, ErrorHandler('Something went wrong'));
        })
    } catch (error) {
        console.log('errorrr',error);
        return res.serverError(500, ErrorHandler(error));
    }
};
