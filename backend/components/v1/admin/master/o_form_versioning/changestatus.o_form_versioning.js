'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Versionings = require('../../../../../models/o_form_versioning');
const { constants } = require('../../../../../config');


module.exports = async (req, res, next) => {
  try {

    const id = req.body.o_form_versioning.id;
    let Check = await Versionings.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler('o_form_versioning not found'));

    const body = req.body.o_form_versioning;
    const o_form_versioning = await new Versionings().where({ id }).save(body, { method: 'update' });

    return res.success({ o_form_versioning });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};