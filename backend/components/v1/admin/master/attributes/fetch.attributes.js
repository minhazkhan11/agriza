'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Attributes = require('../../../../../models/attributes');
const Variants = require('../../../../../models/variant');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    // **Fetch Attributes**
    const attributes = await Attributes.query(qb => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .orderBy('created_at', 'asc');
    }).fetchAll({ require: false });

    if (!attributes || attributes.length === 0) {
      return res.success({ attributes: [] });
    }

    const attriData = attributes.toJSON();

    // **Fetch Variants for Each Attribute**
    for (const attr of attriData) {
      const variDetails = await Variants.query(qb => {
        qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
          .andWhere('attribute_id', attr.id) 
          .orderBy('created_at', 'asc');
      }).fetchAll({ require: false });

      //  Fix: Assign fetched variants to the attribute
      attr.variant_details = variDetails ? variDetails.toJSON() : [];
    }

    return res.success({ attributes: attriData });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
