'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Place = require('../../../../../models/place');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    const { place_name, pin_id } = req.body.place;

    // Validate input
    if (!Array.isArray(place_name) || !pin_id) {
      return res.serverError(400, ErrorHandler('Invalid input data formate'));
    }

    const added_by = req.user.id;

    // Check for existing place names
    const existingPlace = await Place.query((qb) => {
      qb.whereIn('place_name', place_name)
        .whereIn('active_status', ['active', 'inactive']);
    }).fetchAll({ require: false });

    if (existingPlace && existingPlace.length > 0) {
      const existingNames = existingPlace.map((t) => t.get('place_name'));
      return res.serverError(409, ErrorHandler(`Place name already exist: ${existingNames.join(', ')}`));
    }
    // Prepare data for insertion
    const placeData = place_name.map((name) => ({
      place_name: name,
      pin_id,
      added_by,
    }));

    // save data
    const insertedPlace = await Place.collection(placeData).invokeThen('save');

    return res.success({ places: insertedPlace });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};