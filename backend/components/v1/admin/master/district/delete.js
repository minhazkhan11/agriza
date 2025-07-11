'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const District = require('../../../../../models/district');
const { constants } = require('../../../../../config');
module.exports = async (req, res, next) => {
    try {
        //Get logged in user
        let check = await District.where({ id: req.params.id }).fetch({ require: false });
        if (!check)
            return res.serverError(400, ErrorHandler(new Error(' district not found')));        
        await new District().where({ id: req.params.id }).save({ active_status: constants.activeStatus.deleted }, { method: 'update'})
        .then(() => {
            return res.success({'message': ' district deleted successfully'});
        })
        .catch(err => {
            return res.serverError(400, ErrorHandler('Something went wrong'));
        })
    } catch (error) {
        console.log('errorrr',error);
        return res.serverError(500, ErrorHandler(error));
    }
};
