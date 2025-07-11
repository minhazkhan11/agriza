'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Item_Variants = require('../../../../../models/item_variants');
const Item_Variants_price = require('../../../../../models/item_variants_price');

module.exports = async (req, res) => {
  try {
    const { item_variant_price } = req.body;

    if (!item_variant_price || typeof item_variant_price !== 'object') {
      return res.status(400).json({
        error: "'item_variant_price' object is required in the request body."
      });
    }

    const {
      item_variants_id,
      mrp,
      selling_price,
      selling_price_percent,
      cross_price,
      cross_price_percent
    } = item_variant_price;

    if (!item_variants_id || typeof item_variants_id !== 'number') {
      return res.status(400).json({
        error: "'item_variants_id' is required and must be a number."
      });
    }

    // Check if the item variant exists
    const variantExists = await Item_Variants.where({ id: item_variants_id }).fetch({ require: false });
    if (!variantExists) {
      return res.status(404).json({
        error: "Item variant not found with the provided ID."
      });
    }

    // Create new price entry
    const newPrice = await new Item_Variants_price({
      item_variants_id,
      mrp: mrp || 0,
      selling_price: selling_price || 0,
      selling_price_percent: selling_price_percent || 0,
      cross_price: cross_price || 0,
      cross_price_percent: cross_price_percent || 0,
      added_by: req.user.id
    }).save();

    return res.status(201).json({
      message: "Item variant price update successfully.",
      item_variant_price: newPrice.toJSON()
    });

  } catch (error) {
    return res.status(500).json({ error: ErrorHandler(error) });
  }
};
