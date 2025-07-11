'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Gst = require('../../../../../models/be_gst_details');

const { constants } = require('../../../../../config');


module.exports = async (req, res, next) => {
  try {

    const id = req.body.be_gst_details.id;
    let Check = await Gst.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler('be_gst_details not found'));

    const body = req.body.be_gst_details;
    const be_gst_details = await new Gst().where({ id }).save(body, { method: 'update' });

    return res.success({ be_gst_details });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};