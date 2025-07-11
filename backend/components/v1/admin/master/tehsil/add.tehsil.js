'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Tehsil = require('../../../../../models/tehsil');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    const { tehsil_name, district_id } = req.body.tehsil;

    // Validate input
    if (!Array.isArray(tehsil_name) || !district_id) {
      return res.serverError(400, ErrorHandler('Invalid input data formate'));
    }

    const added_by = req.user.id;

    // Check for existing tehsil names
    const existingTehsils = await Tehsil.query((qb) => {
      qb.whereIn('tehsil_name', tehsil_name)
        .whereIn('active_status', ['active', 'inactive']);
    }).fetchAll({ require: false });

    if (existingTehsils && existingTehsils.length > 0) {
      const existingNames = existingTehsils.map((t) => t.get('tehsil_name'));
      return res.serverError(409, ErrorHandler(`Tehsil names already exist: ${existingNames.join(', ')}`));
    }

    // Prepare data for insertion
    const tehsilData = tehsil_name.map((name) => ({
      tehsil_name: name,
      district_id,
      added_by,
    }));

    // save
    const insertedTehsils = await Tehsil.collection(tehsilData).invokeThen('save');

    return res.success({ tehsils: insertedTehsils });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
