'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Assigned = require('../../../../../models/assigned_item_variant_to_vendor');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    const { vendor_be_id, item_variants_id = [] } = req.body.assigned;
    const added_by = req.user.id;

    // Validate input
    if (!vendor_be_id || !Array.isArray(item_variants_id)) {
      return res.serverError(400, ErrorHandler("Invalid input data"));
    }

    // Get all existing assigned items for this vendor and user
    const existingAssignments = await Assigned
      .where({ vendor_be_id, added_by })
      .fetchAll({ require: false });

    const existingMap = new Map();
    existingAssignments.forEach((item) => {
      existingMap.set(item.get('item_variants_id'), item);
    });

    // Step 1: Reactivate or Insert New Records
    for (const variantId of item_variants_id) {
      const existing = existingMap.get(variantId);

      if (existing) {
        if (existing.get('active_status') === constants.activeStatus.inactive) {
          existing.set('active_status', constants.activeStatus.active);
          await existing.save();
        }
        // Already active — do nothing
      } else {
        // New assignment
        await new Assigned({
          vendor_be_id,
          added_by,
          item_variants_id: variantId,
          active_status: constants.activeStatus.active,
        }).save();
      }
    }

    // Step 2: Deactivate any records not in current input
    for (const [variantId, record] of existingMap.entries()) {
      if (!item_variants_id.includes(variantId) && record.get('active_status') === constants.activeStatus.active) {
        record.set('active_status', constants.activeStatus.inactive);
        await record.save();
      }
    }

    return res.success({ message: 'Assignments updated successfully' });

  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
