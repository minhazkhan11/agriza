'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Item_Variants = require('../../../../../models/item_variants');
const Item_Variants_price = require('../../../../../models/item_variants_price');
const Item_Variants_stock = require('../../../../../models/item_variants_stock');
const Item_Variants_assigned_price = require('../../../../../models/item_varint_assigned_price_and_logistic_area');
const Product = require('../../../../../models/product');
const bookshelf = require('../../../../../config/bookshelf'); // Ensure this points to your configured Bookshelf instance

function generateSKU(product_name = 'ITEM') {
  const shortProduct = product_name.replace(/\s+/g, '').toUpperCase().slice(0, 5);
  const timestamp = Date.now().toString().slice(-3);
  return `${shortProduct}${timestamp}`;
}

module.exports = async (req, res) => {
  try {
    let { item_id, attribute_ids, variants_ids, varint_price, item_variants } = req.body;

    if (!Array.isArray(item_variants) || item_variants.length === 0) {
      return res.status(400).json({ error: "Invalid request body. Expecting an array of item_variants." });
    }

    if (!Array.isArray(attribute_ids) || !Array.isArray(variants_ids)) {
      return res.status(400).json({ error: "attribute_ids and variants_ids must be arrays." });
    }

    let product_name = 'item';
    if (item_id) {
      const product = await Product.where({ id: item_id }).fetch({ require: false });
      product_name = product ? product.get('product_name') : 'item';
    }

    const createdVariants = [];

    await bookshelf.transaction(async (trx) => {
      for (let body of item_variants) {
        body.added_by = req.user.id;

        const {
          moq, primary_unit_id, delivery_ex, delivery_for, primary_quantity,
          for_selling_price_percent, for_selling_price, secondary_unit_id, secondary_quantity,
          covering_unit_id, covering_quantity, covering_length, covering_width, covering_thickness,
          covering_weight, piece_weight, piece_length, piece_width, piece_thickness,
          variant_name, ex_mrp, for_mrp, ex_selling_price, effective_date, ex_selling_price_percent, ex_cross_price, item_delivery_type,
          ex_cross_price_percent, stock, sku_code, stock_status, price,
          for_cross_price, for_cross_price_percent
        } = body;

        const existing = await Item_Variants
          .where({ item_id, variant_name: body.variant_name, active_status: "active" })
          .fetch({ require: false, transacting: trx });

        if (existing) {
          throw new Error(`Variant '${body.variant_name}' already exists for this item.`);
        }
        const item_variant = await new Item_Variants({
          item_id,
          varint_price: varint_price || 0,
          attribute_ids: JSON.stringify(attribute_ids),
          variants_ids: JSON.stringify(variants_ids),
          variant_name,
          moq,
          primary_unit_id: primary_unit_id || null,
          primary_quantity,
          secondary_unit_id: secondary_unit_id || null,
          secondary_quantity,
          covering_unit_id: covering_unit_id || null,
          covering_quantity,
          covering_length,
          ex: delivery_ex,
          for: delivery_for,
          covering_width,
          covering_thickness,
          covering_weight, piece_weight, piece_length, piece_width, piece_thickness,
          added_by: req.user.id
        }).save(null, { transacting: trx });

        let logisticPriceIds = [];

        if (Array.isArray(price) && price.length > 0) {
          for (let logistic of price) {
            const assigned = await new Item_Variants_assigned_price({
              Logistic_area_id: logistic.Logistic_area_id || null,
              price: logistic.price || 0,
              added_by: req.user.id
            }).save(null, { transacting: trx });

            logisticPriceIds.push(assigned.id);
          }
        }

        await item_variant.save(
          { logistic_area_and_price_ids: logisticPriceIds.length ? JSON.stringify(logisticPriceIds) : null },
          { patch: true, transacting: trx }
        );

        // Prices
        if (delivery_ex) {
          await new Item_Variants_price({
            item_variants_id: item_variant.id,
            mrp: ex_mrp || 0,
            item_delivery_type: 'ex',
            selling_price: ex_selling_price || 0,
            effective_date: effective_date,
            selling_price_percent: ex_selling_price_percent || 0,
            cross_price: ex_cross_price || 0,
            cross_price_percent: ex_cross_price_percent || 0,
            added_by: req.user.id
          }).save(null, { transacting: trx });
        }

        if (delivery_for) {
          await new Item_Variants_price({
            item_variants_id: item_variant.id,
            mrp: for_mrp || 0,
            item_delivery_type: 'for',
            selling_price: for_selling_price || 0,
            effective_date: effective_date,
            selling_price_percent: for_selling_price_percent || 0,
            cross_price: for_cross_price || 0,
            cross_price_percent: for_cross_price_percent || 0,
            added_by: req.user.id
          }).save(null, { transacting: trx });
        }

        const generatedSKU = sku_code || generateSKU(product_name);

        const item_variant_stock = await new Item_Variants_stock({
          item_variants_id: item_variant.id,
          sku_code: generatedSKU,
          stock: stock || 0,
          stock_status: stock_status || "opening",
          added_by: req.user.id
        }).save(null, { transacting: trx });

        createdVariants.push({
          id: item_variant.id,
          variant_name: item_variant.get("variant_name"),
          moq, primary_unit_id, item_delivery_type, primary_quantity, secondary_unit_id, secondary_quantity,
          covering_unit_id, covering_quantity, covering_length, covering_width, covering_thickness,
          covering_weight, piece_weight, piece_length, piece_width, piece_thickness,
          active_status: item_variant.get("active_status"),
          created_at: item_variant.get("created_at"),
          updated_at: item_variant.get("updated_at"),
          price: price || [],
          item_variant_stock: item_variant_stock.toJSON()
        });
      }
    });

    return res.status(201).json({
      message: "Item variants created successfully",
      item_id,
      attribute_ids,
      variants_ids,
      varint_price,
      item_variants: createdVariants
    });

  } catch (error) {
    return res.status(500).json({ error: ErrorHandler(error) });
  }
};
