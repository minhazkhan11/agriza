'use strict';

const { ErrorHandler} = require('../../../../../lib/utils');
const Pin = require('../../../../../models/pin');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    const { pin_code, tehsil_id } = req.body.pin;

    // Validate input
    if (!Array.isArray(pin_code) || !tehsil_id) {
      return res.serverError(400, ErrorHandler('Invalid input data formate'));
    }

    const added_by = req.user.id;

    // Check for existing pin names
    const existingPin = await Pin.query((qb) => {
      qb.whereIn('pin_code', pin_code)
        .whereIn('active_status', ['active', 'inactive']);
    }).fetchAll({ require: false });

    if (existingPin && existingPin.length > 0) {
      const existingNames = existingPin.map((t) => t.get('pin_code'));
      return res.serverError(409, ErrorHandler(`Pin code already exist: ${existingNames.join(', ')}`));
    }

    // Prepare data for insertion
    const pinData = pin_code.map((pincode) => ({
      pin_code: pincode,
      tehsil_id,
      added_by,
    }));

    // save
    const insertedPin = await Pin.collection(pinData).invokeThen('save');

    return res.success({ pin: insertedPin });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
