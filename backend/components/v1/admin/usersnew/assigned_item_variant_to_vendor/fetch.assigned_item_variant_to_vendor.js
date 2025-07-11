'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Assigned = require('../../../../../models/assigned_item_variant_to_vendor');
const BeIdentityTable = require('../../../../../models/be_identity_table');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    const added_by = req.user.id;

    // Step 1: Fetch valid vendor_be_ids from BeIdentityTable for the current user
    const beIdentities = await BeIdentityTable
      .query(qb => {
        qb.where('added_by', added_by)
          .andWhere('entity_type', 'vendor');
      })
      .fetchAll({ require: false });

    const validBeIds = beIdentities.toJSON().map(entry => entry.be_id);

    if (!validBeIds.length) {
      return res.success({ assignedItems: [] }); // No matching vendors
    }

    // Step 2: Fetch assigned items for the valid vendor_be_ids
    const assignedItems = await Assigned
      .query(qb => {
        qb.where('added_by', added_by)
          .andWhere('active_status', constants.activeStatus.active)
          .whereIn('vendor_be_id', validBeIds);
      })
      .fetchAll({

        require: false
      });

    // Step 3: Return the fetched assigned items
    return res.success({ assignedItems });

  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
