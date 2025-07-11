'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const TemplateWhatsapp = require('../../../../../models/templateWhatsapp');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        //Get logged in user
        let template = await TemplateWhatsapp.where({ id: req.params.id }).fetch({ require: false });
        if (!template)
            return res.serverError(400, ErrorHandler(new Error('template whatsapp not found')));        
        await new TemplateWhatsapp().where({ id: req.params.id }).save({ active_status: constants.activeStatus.deleted }, { method: 'update'})
        .then(() => {
            return res.success({'message': 'template whatsapp deleted successfully'});
        })
        .catch(err => {
            return res.success({'message': 'Something went wrong'});
        })
    } catch (error) {
        console.log('errorrr',error);
        return res.serverError(500, ErrorHandler(error));
    }
};
