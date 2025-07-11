'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Gst = require('../../../../../models/gst_percent');
const { constants } = require('../../../../../config');


module.exports = async (req, res, next) => {
  try {

    const id = req.body.gst_percent.id;
    let Check = await Gst.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler('gst_percent not found'));

    const body = req.body.gst_percent;
    const gst_percent = await new Gst().where({ id }).save(body, { method: 'update' });

    return res.success({ gst_percent });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};