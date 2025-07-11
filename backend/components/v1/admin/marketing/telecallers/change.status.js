'use strict';

const { ErrorHandler, uploadImage, processAttachment } = require('../../../../../lib/utils');
const telecallers = require('../../../../../models/telecallers');
const telecallersLists = require('../../../../../models/telecallersLists');
const { constants } = require('../../../../../config');;

module.exports = async (req, res, next) => {
    try {

        const telecallerId = req.body.telecaller.id;
        let Check = await telecallersLists.where({ id: telecallerId }).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('telecallersLists not found'));

        const body = req.body.telecaller;
        const telecaller = await new telecallersLists().where({ id: telecallerId }).save(body, {method: 'update'}); 
          res.success({ telecaller });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};