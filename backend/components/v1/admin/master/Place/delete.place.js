'use strict';
const { ErrorHandler} = require('../../../../../lib/utils');
const Place = require('../../../../../models/place');
const { constants } = require('../../../../../config');
module.exports = async (req, res, next) => {
    try {
        //Get logged in user
        let check = await Place.where({ id: req.params.id }).fetch({ require: false });
        if (!check)
            return res.serverError(400, ErrorHandler(new Error(' place name not found')));        
        await new Place().where({ id: req.params.id }).save({ active_status: constants.activeStatus.deleted }, { method: 'update'})
        .then(() => {
            return res.success({'message': ' place name deleted successfully'});
        })
        .catch(err => {
            return res.serverError(400, ErrorHandler('Something went wrong'));
        })
    } catch (error) {
        console.log('errorrr',error);
        return res.serverError(500, ErrorHandler(error));
    }
};
