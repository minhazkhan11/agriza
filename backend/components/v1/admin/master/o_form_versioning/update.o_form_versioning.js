'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Versionings = require('../../../../../models/o_form_versioning');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    const body = req.body.o_form_versioning;
    const id = body.id;

    // Fetch existing record
    const existing = await Versionings.where({ id }).fetch({ require: false });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'O_form_versioning not found' });
    }

    // Handle license_product_id (array to JSON string or null)
    body.license_product_id = Array.isArray(body.license_product_id) && body.license_product_id.length > 0
      ? JSON.stringify(body.license_product_id)
      : null;

    // If license_id is not valid, set to null (optional)
    if (!body.license_id || isNaN(body.license_id)) {
      body.license_id = null;
    }

    // Set updated_by from user context
    body.added_by = req.user.id;

    const updatedVersioning = await existing.save(body, { patch: true });

    return res.success({ o_form_versioning: updatedVersioning });
  } catch (error) {
    console.error(error);
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
