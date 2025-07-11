'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Bankdetails = require('../../../../../models/be_bank_details');
const { constants } = require('../../../../../config');



module.exports = async (req, res, next) => {
  try {

    const id = req.body.bankdetails.id;
    let Check = await Bankdetails.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler(' Businessinformation name not found'));

    const body = req.body.bankdetails;
    const bankdetails = await new Bankdetails().where({ id }).save(body, { method: 'update' });

    return res.success({ bankdetails });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};