'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Marketers = require('../../../../../models/marketers');
const { constants } = require('../../../../../config');
const Attachments = require('../../../../../models/attachments');


module.exports = async (req, res, next) => {
  try {

    const id = req.body.marketers.id;
    let Check = await Marketers.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler('Marketers not found'));

    const body = req.body.marketers;
    const marketers = await new Marketers().where({ id }).save(body, { method: 'update' });

    const newmarketers = await Marketers.where({ id }).fetch({ require: false });

    return res.success({ marketers: newmarketers });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};