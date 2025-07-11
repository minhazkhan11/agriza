'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Catalogue = require('../../../../../models/product_catalogue');
const Assigned = require('../../../../../models/assigned_to');

module.exports = async (req, res) => {
  try {
    let { product_catalogue } = req.body;

  
    if (!Array.isArray(product_catalogue.Product_id) || product_catalogue.Product_id.length === 0) {
      return res.serverError(400, ErrorHandler("Product_id should be an array with at least one ID."));
    }

    const assignedRecord = await Assigned.where({ user_id: req.user.id }).fetch({ require: false });

    if (!assignedRecord) {
      return res.serverError(400, ErrorHandler("No assigned entity found for this user."));
    }

    const be_information_id = assignedRecord.get('be_information_id');
    const added_by = req.user.id;

    let insertedProducts = [];

 
    for (const product_id of product_catalogue.Product_id) {
      let existingCatalogue = await Catalogue
        .query((qb) => {
          qb.where('be_information_id', be_information_id)
            .where('Product_id', product_id)
            .whereIn('active_status', ['active', 'inactive']);
        })
        .fetch({ require: false });

      let productEntry;
      if (existingCatalogue) {
        // If exists, update it
        productEntry = await existingCatalogue.save({ added_by }, { patch: true });
      } else {
        // Otherwise, create a new entry
        productEntry = await new Catalogue({
          be_information_id,
          Product_id: product_id,
          added_by
        }).save();
      }

      insertedProducts.push(productEntry);
    }

    return res.success({ product_catalogue: insertedProducts });

  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
