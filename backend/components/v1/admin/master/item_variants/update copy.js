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
      mrp, item_id, selling_price, selling_price_percent,
      cross_price, cross_price_percent, stock, stock_status,
      price
    } = req.body;

    if (!item_variants_id) {
      return res.status(400).json({ error: "item_variants_id is required for updating." });
    }

    const item_variant = await Item_Variants.where({ id: item_variants_id }).fetch({ require: false });
    if (!item_variant) {
      return res.status(404).json({ error: "Item variant not found." });
    }

    // Safely parse logistic_area_and_price_ids
    let logisticAreaIds = [];
    let item_variant_price = [];
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
      item_delivery_type,
      attribute_ids: Array.isArray(attribute_ids) ? JSON.stringify(attribute_ids) : '[]',
      variants_ids: Array.isArray(variants_ids) ? JSON.stringify(variants_ids) : '[]',
      moq,
      primary_unit_id: primary_unit_id || null,
      primary_quantity,
      secondary_unit_id: secondary_unit_id || null,
      secondary_quantity,
      covering_unit_id: covering_unit_id || null,
      covering_quantity,
      covering_length,
      covering_width,
      covering_thickness,
      covering_weight,
      piece_weight,
      piece_length,
      piece_width,
      piece_thickness,
      item_id,
      logistic_area_and_price_ids: JSON.stringify(logisticAreaIds),
      added_by: req.user.id,
      updated_at: new Date()
    });

    // // Update Item_Variants_price
    // const item_variant_price = await Item_Variants_price.where({ item_variants_id }).fetch({ require: false });
    // if (item_variant_price) {
    //   await item_variant_price.save({
    //     mrp,
    //     selling_price,
    //     selling_price_percent,
    //     cross_price,
    //     cross_price_percent,
    //     added_by: req.user.id,
    //     updated_at: new Date()
    //   });
    // }

    // Update multiple Item_Variants_price records
    if (Array.isArray(req.body.item_variant_price)) {
      for (const price of req.body.item_variant_price) {
        if (price.id) {
          const existingPrice = await Item_Variants_price.where({ id: price.id }).fetch({ require: false });
          if (existingPrice) {
            await existingPrice.save({
              mrp: price.mrp || 0,
              selling_price: price.selling_price || 0,
              selling_price_percent: price.selling_price_percent || 0,
              cross_price: price.cross_price || 0,
              cross_price_percent: price.cross_price_percent || 0,
              updated_at: new Date(),
              added_by: req.user.id
            }, { patch: true });
          }
        }
      }
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

    // Update assigned price if price array provided
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
    const updatedItemVariantPrices = await Item_Variants_price.where({ item_variants_id }).fetchAll();
    return res.status(200).json({
      message: "Item variant updated successfully",
      item_variants_id,
      updated_variant: item_variant.toJSON(),
      updated_price: updatedItemVariantPrices || [],
      updated_stock: item_variant_stock ? item_variant_stock.toJSON() : null,
    });

  } catch (error) {
    return res.status(500).json({ error: ErrorHandler(error) });
  }
};
