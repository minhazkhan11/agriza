
'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Deliverypoint = require('../../../../../models/deliverypoint');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {

    const id = req.body.ship_to_party.id;
    let Check = await Deliverypoint.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler('Delivery point not found'));

    const body = req.body.ship_to_party;
    const ship_to_party = await new Deliverypoint().where({ id }).save(body, { method: 'update' });

    return res.success({ ship_to_party });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};