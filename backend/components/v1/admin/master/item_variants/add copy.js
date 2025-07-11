
// 'use strict';

// const { ErrorHandler } = require('../../../../../lib/utils');
// const Item_Variants = require('../../../../../models/item_variants');
// const Item_Variants_price = require('../../../../../models/item_variants_price');
// const Item_Variants_stock = require('../../../../../models/item_variants_stock');
// const Product = require('../../../../../models/product');  // Import Product Model
// const { constants } = require('../../../../../config');

// // Function to generate a unique SKU Code using product_name
// function generateSKU(product_name, variant_name) {
//   const timestamp = Date.now().toString().slice(-4); // Last 4 digits of timestamp
//   return `SKU-${(product_name || 'item').replace(/\s+/g, '').toUpperCase()}-${(variant_name || 'VARIANT').replace(/\s+/g, '').toUpperCase()}-${timestamp}`;
// }

// module.exports = async (req, res) => {
//   try {
//     let body = req.body.item_variants;

//     if (!body || typeof body !== "object") {
//       return res.status(400).json({ error: "Invalid request body" });
//     }

//     const jsonFields = ["attribute_ids", "variants_ids"];
//     jsonFields.forEach(field => {
//       if (body[field] && typeof body[field] !== "string") {
//         try {
//           body[field] = JSON.stringify(body[field]);
//         } catch (e) {
//           return res.status(400).json({ error: `Invalid JSON format in ${field}` });
//         }
//       }
//     });


//     body.added_by = req.user.id;

//     const {
//       mrp, selling_price, selling_price_percent, cross_price, cross_price_percent,
//       stock, sku_code, stock_status, item_id, variant_name, ...itemVariantData
//     } = body;

//     let product_name = 'item';
//     if (item_id) {
//       const product = await Product.where({ id: item_id }).fetch({ require: false });
//       product_name = product ? product.get('product_name') : 'item';
//     }

//     const item_variant = await new Item_Variants({ ...itemVariantData, item_id, variant_name }).save();

//     if (item_variant?.id) {
//       // Save Pricing Data in Item_Variants_price
//       const item_variant_price = await new Item_Variants_price({
//         item_variants_id: item_variant.id,
//         mrp: mrp || null,
//         selling_price: selling_price || null,
//         selling_price_percent: selling_price_percent || null,
//         cross_price: cross_price || null,
//         cross_price_percent: cross_price_percent || null,
//         added_by: req.user.id
//       }).save();

//       // Generate SKU code if not provided
//       const generatedSKU = sku_code || generateSKU(product_name, variant_name);

//       // Save Stock Data in Item_Variants_stock
//       const item_variant_stock = await new Item_Variants_stock({
//         item_variants_id: item_variant.id,
//         sku_code: generatedSKU,
//         stock: stock || 0,
//         stock_status: stock_status || "opening",
//         added_by: req.user.id
//       }).save();

//       return res.status(201).json({
//         message: "Item variant created successfully",
//         item_variant,
//         item_variant_price,
//         item_variant_stock
//       });
//     }

//     return res.status(500).json({ error: "Failed to create item variant" });

//   } catch (error) {
//     return res.status(500).json({ error: ErrorHandler(error) });
//   }
// };
'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Item_Variants = require('../../../../../models/item_variants');
const Item_Variants_price = require('../../../../../models/item_variants_price');
const Item_Variants_stock = require('../../../../../models/item_variants_stock');
const Item_Variants_assigned_price = require('../../../../../models/item_varint_assigned_price_and_logistic_area');
const Product = require('../../../../../models/product');
const { constants } = require('../../../../../config');

// Function to generate a unique SKU Code using product_name and variant_name
// function generateSKU(product_name, variant_name) {
//   const timestamp = Date.now().toString().slice(-4);
//   return `SKU-${(product_name || 'item').replace(/\s+/g, '').toUpperCase()}-${(variant_name || 'VARIANT').replace(/\s+/g, '').toUpperCase()}-${timestamp}`;
// }
function generateSKU(product_name = 'ITEM') {
  const shortProduct = product_name.replace(/\s+/g, '').toUpperCase().slice(0, 5); // 3 chars
  // const shortVariant = variant_name.replace(/\s+/g, '').toUpperCase().slice(0, 2); // 2 chars
  const timestamp = Date.now().toString().slice(-3); // 3 digits

  return `${shortProduct}${timestamp}`; // Total = 8
}

module.exports = async (req, res) => {
  try {
    let { item_id, attribute_ids, variants_ids, varint_price, item_variants } = req.body;

    if (!Array.isArray(item_variants) || item_variants.length === 0) {
      return res.status(400).json({ error: "Invalid request body. Expecting an array of item item_variants." });
    }

    if (!Array.isArray(attribute_ids) || !Array.isArray(variants_ids)) {
      return res.status(400).json({ error: "attribute_ids and variants_ids must be arrays." });
    }

    let product_name = 'item';
    if (item_id) {
      const product = await Product.where({ id: item_id }).fetch({ require: false });
      product_name = product ? product.get('product_name') : 'item';
    }

    let createdVariants = [];

    for (let body of item_variants) {
      body.added_by = req.user.id;

      const {
        moq, primary_unit_id, primary_quantity, secondary_unit_id, secondary_quantity,
        covering_unit_id, covering_quantity, covering_length, covering_width, covering_thickness,
        covering_weight, piece_weight, piece_length, piece_width, piece_thickness,
        variant_name, mrp, selling_price, selling_price_percent, cross_price, item_delivery_type,
        cross_price_percent, stock, sku_code, stock_status, price, Logistic_area_id
      } = body;


      // const item_Variants_assigned = await new Item_Variants_assigned_price({
      //   Logistic_area_id: Logistic_area_id || null,
      //   price: price || 0,
      //   added_by: req.user.id
      // }).save();
      // Save Item Variant (new row for each variant)
      const item_variant = await new Item_Variants({
        item_id,
        varint_price: varint_price || 0,
        attribute_ids: JSON.stringify(attribute_ids),
        variants_ids: JSON.stringify(variants_ids),
        variant_name,
        moq,
        item_delivery_type,
        primary_unit_id: primary_unit_id || null,
        primary_quantity,
        secondary_unit_id: secondary_unit_id || null,
        secondary_quantity,
        covering_unit_id: covering_unit_id || null,
        covering_quantity,
        covering_length
        , covering_width, covering_thickness,
        covering_weight, piece_weight, piece_length, piece_width, piece_thickness,
        added_by: req.user.id
      }).save();

      let logisticPriceIds = null;

      if (Array.isArray(price) && price.length > 0) {
        logisticPriceIds = [];

        for (let logistic of price) {
          const item_Variants_assigned = await new Item_Variants_assigned_price({
            Logistic_area_id: logistic.Logistic_area_id || null,
            price: logistic.price || 0,
            added_by: req.user.id
          }).save();

          logisticPriceIds.push(item_Variants_assigned.id);
        }
      }

      // Always set the field — either an array or null
      await item_variant.save(
        { logistic_area_and_price_ids: logisticPriceIds ? JSON.stringify(logisticPriceIds) : null },
        { patch: true }
      );


      if (item_variant?.id) {
        // Save Pricing Data
        const item_variant_price = await new Item_Variants_price({
          item_variants_id: item_variant.id,
          mrp: mrp || 0,
          selling_price: selling_price || 0,
          selling_price_percent: selling_price_percent || 0,
          cross_price: cross_price || 0,
          cross_price_percent: cross_price_percent || 0,

          added_by: req.user.id
        }).save();

        // Generate SKU code if not provided
        const generatedSKU = sku_code || generateSKU(product_name);

        // Save Stock Data
        const item_variant_stock = await new Item_Variants_stock({
          item_variants_id: item_variant.id,
          sku_code: generatedSKU,
          stock: stock || 0,
          stock_status: stock_status || "opening",
          added_by: req.user.id
        }).save();

        // Push structured response for each variant
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
          item_variant_price: item_variant_price.toJSON(),
          item_variant_stock: item_variant_stock.toJSON()
        });
      }
    }

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
