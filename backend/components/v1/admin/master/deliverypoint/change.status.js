'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Deliverypoint = require('../../../../../models/deliverypoint');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.delivery_point.id;
        let Check = await Deliverypoint.where({ id }).fetch({ require: false });
        if (!Check)
            return res.serverError(400, ErrorHandler('Delivery point not found'));

        const body = req.body.delivery_point;
        const delivery_point_Details = await new Deliverypoint().where({ id }).save(body, { method: 'update' });

        return res.success({ delivery_point_Details });
    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};