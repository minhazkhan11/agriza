'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Item_Variants = require('../../../../../models/item_variants');
const Item_Variants_price = require('../../../../../models/item_variants_price');

module.exports = async (req, res) => {
  try {
    const { item_variants_id } = req.params;

    if (!item_variants_id || isNaN(item_variants_id)) {
      return res.status(400).json({
        error: "'item_variants_id' is required and must be a number."
      });
    }

    const variantExists = await Item_Variants.where({ id: item_variants_id }).fetch({ require: false });

    if (!variantExists) {
      return res.status(404).json({
        error: "Item variant not found with the provided ID."
      });
    }


    const prices = await Item_Variants_price
      .query(qb => {
        qb.where({ item_variants_id });
        qb.orderBy('created_at', 'DESC');
      })
      .fetchAll({ require: false });

    const result = prices?.toJSON?.() || [];

    return res.json({
      success: true,
      item_variant_prices: result
    });

  } catch (error) {
    return res.status(500).json({ error: ErrorHandler(error) });
  }
};
