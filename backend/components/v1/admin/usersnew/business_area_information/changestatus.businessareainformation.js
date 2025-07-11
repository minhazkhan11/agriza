'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Businessinformation = require('../../../../../models/be_area_information');
const { constants } = require('../../../../../config');


module.exports = async (req, res, next) => {
  try {

    const id = req.body.business_information.id;
    let Check = await Businessinformation.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler(' Businessinformation name not found'));

    const body = req.body.business_information;
    const business_information = await new Businessinformation().where({ id }).save(body, { method: 'update' });

    return res.success({ business_information });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};