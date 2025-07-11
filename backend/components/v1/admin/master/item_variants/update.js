'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Item_Variants = require('../../../../../models/item_variants');
const Item_Variants_price = require('../../../../../models/item_variants_price');
const Item_Variants_stock = require('../../../../../models/item_variants_stock');
const Item_Variants_assigned_price = require('../../../../../models/item_varint_assigned_price_and_logistic_area');

module.exports = async (req, res) => {
  try {
    let {
      item_variants_id, varint_price, item_delivery_type, variant_name,
      attribute_ids, variants_ids, moq, primary_unit_id, primary_quantity,
      secondary_unit_id, secondary_quantity, covering_unit_id, covering_quantity,
      covering_length, covering_width, covering_thickness, covering_weight,
      piece_weight, piece_length, piece_width, piece_thickness,
      ex_mrp, item_id, ex_selling_price, ex_selling_price_percent,
      ex_cross_price, ex_cross_price_percent, stock, stock_status,
      price,
      effective_date,
      ex, for: forVal,
      for_mrp, for_selling_price, for_selling_price_percent,
      for_cross_price, for_cross_price_percent
    } = req.body;

    if (!item_variants_id) {
      return res.status(400).json({ error: "item_variants_id is required for updating." });
    }

    const item_variant = await Item_Variants.where({ id: item_variants_id }).fetch({ require: false });
    if (!item_variant) {
      return res.status(404).json({ error: "Item variant not found." });
    }

    // Parse logistic_area_and_price_ids
    let logisticAreaIds = [];
    try {
      const raw = item_variant.get('logistic_area_and_price_ids');
      logisticAreaIds = Array.isArray(raw)
        ? raw
        : typeof raw === 'string'
          ? JSON.parse(raw)
          : [];
    } catch (e) {
      logisticAreaIds = [];
    }

    // Update Item_Variants
    await item_variant.save({
      variant_name,
      varint_price,
      attribute_ids: Array.isArray(attribute_ids)
        ? JSON.stringify(attribute_ids)
        : JSON.stringify(item_variant.get('attribute_ids')),

      variants_ids: Array.isArray(variants_ids)
        ? JSON.stringify(variants_ids)
        : JSON.stringify(item_variant.get('variants_ids')),

      moq,
      primary_unit_id: primary_unit_id ?? item_variant.get('primary_unit_id'),
      primary_quantity,
      secondary_unit_id: secondary_unit_id ?? item_variant.get('secondary_unit_id'),
      secondary_quantity,
      covering_unit_id: covering_unit_id ?? item_variant.get('covering_unit_id'),
      covering_quantity,
      covering_length,
      covering_width,
      covering_thickness,
      covering_weight,
      piece_weight,
      piece_length,
      piece_width,
      piece_thickness,
      item_id: item_id ?? item_variant.get('item_id'),
      ex: ex || false,
      for: forVal || false,
      logistic_area_and_price_ids: JSON.stringify(logisticAreaIds),
      added_by: req.user.id,
      updated_at: new Date()
    });

    let item_variant_price = null; // <-- define first
    // Update EX price
    // Update or Create EX price
    // Always INSERT new EX price


    if (ex) {
      await Item_Variants_price.forge({
        item_variants_id,
        item_delivery_type: 'ex',
        effective_date: effective_date,
        mrp: Number(ex_mrp),
        selling_price: Number(ex_selling_price),
        selling_price_percent: Number(ex_selling_price_percent),
        cross_price: Number(ex_cross_price),
        cross_price_percent: Number(ex_cross_price_percent),
        added_by: req.user.id,
        created_at: new Date(),
        updated_at: new Date()
      }).save();
    }

    if (forVal) {
      await Item_Variants_price.forge({
        item_variants_id,
        effective_date: effective_date,
        item_delivery_type: 'for',
        mrp: Number(for_mrp),
        selling_price: Number(for_selling_price),
        selling_price_percent: Number(for_selling_price_percent),
        cross_price: Number(for_cross_price),
        cross_price_percent: Number(for_cross_price_percent),
        added_by: req.user.id,
        created_at: new Date(),
        updated_at: new Date()
      }).save();
    }





    // Update Item_Variants_stock
    const item_variant_stock = await Item_Variants_stock.where({ item_variants_id }).fetch({ require: false });
    if (item_variant_stock) {
      await item_variant_stock.save({
        stock,
        stock_status,
        added_by: req.user.id,
        updated_at: new Date()
      });
    }

    // Update assigned prices if price array is provided
    if (Array.isArray(price)) {
      for (const p of price) {
        if (p.id && logisticAreaIds.includes(Number(p.id))) {
          const existingEntry = await Item_Variants_assigned_price.where({ id: p.id }).fetch({ require: false });
          if (existingEntry) {
            await existingEntry.save({
              Logistic_area_id: p.Logistic_area_id || null,
              price: p.price || 0,
              updated_at: new Date(),
              added_by: req.user.id
            });
          }
        }
      }
    }
    const exPrice = await Item_Variants_price
      .where({ item_variants_id, item_delivery_type: 'ex' })
      .fetch({ require: false });

    const forPrice = await Item_Variants_price
      .where({ item_variants_id, item_delivery_type: 'for' })
      .fetch({ require: false });

    const updated_price = {
      ex: exPrice ? exPrice.toJSON() : null,
      for: forPrice ? forPrice.toJSON() : null
    };


    return res.status(200).json({
      message: "Item variant updated successfully",
      item_variants_id,
      updated_variant: item_variant.toJSON(),
      updated_price,

      updated_stock: item_variant_stock ? item_variant_stock.toJSON() : null
    });

  } catch (error) {
    return res.status(500).json({ error: ErrorHandler(error) });
  }
};
