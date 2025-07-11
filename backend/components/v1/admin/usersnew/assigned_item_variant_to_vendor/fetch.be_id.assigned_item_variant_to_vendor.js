'use strict';

const Assignedvendor = require('../../../../../models/assigned_item_variant_to_vendor');
const BeIdentityTable = require('../../../../../models/be_identity_table');
const { constants } = require('../../../../../config');
const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
const Item_Variants = require('../../../../../models/item_variants');
const Item_Variants_price = require('../../../../../models/item_variants_price');
const Item_Variants_stock = require('../../../../../models/item_variants_stock');
const Attributes = require('../../../../../models/attributes');
const Variants = require('../../../../../models/variant');
const Assigned = require('../../../../../models/item_varint_assigned_price_and_logistic_area');
const Logistic = require('../../../../../models/logistic_area');
const MasterProduct = require('../../../../../models/master_product');
const Gst = require('../../../../../models/gst_percent');

const Attachments = require('../../../../../models/attachments');

module.exports = async (req, res) => {
  try {
    const added_by = req.user.id;

    const { vendor_be_id } = req.params;


    if (!vendor_be_id) {
      return res.status(400).json({
        success: false,
        message: 'Vendor Be ID is required',
      });
    }

    const beIdentities = await BeIdentityTable
      .query(qb => {
        qb.where('added_by', added_by)
          .andWhere('entity_type', 'vendor');
      })
      .fetchAll({ require: false });

    const beIdentitiesJson = beIdentities.toJSON();
  

    const validBeIds = beIdentitiesJson.map(entry => entry.be_id);


    if (!validBeIds.map(String).includes(String(vendor_be_id))) {

      return res.status(400).json({
        success: false,
        message: 'Invalid Vendor Be ID',
      });
    }

    // Step 3: Fetch assigned items for the specific vendor_be_id
    const assignedItems = await Assignedvendor
      .query(qb => {
        qb.where('added_by', added_by)
          .andWhere('active_status', constants.activeStatus.active)
          .where('vendor_be_id', vendor_be_id);
      })
      .fetchAll({ require: false });

    const assignedItemIds = assignedItems.toJSON().map(i => i.item_variants_id);
    const itemVariants = await Item_Variants.query(qb => {
      qb.whereIn('id', assignedItemIds).andWhere('active_status', constants.activeStatus.active)
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      withRelated: [
        { 'item_id': qb => qb.select('id', 'product_name', 'master_product_id') },
        { 'primary_unit_id': qb => qb.select('id', 'unit_name') },
        { 'secondary_unit_id': qb => qb.select('id', 'unit_name') },
        { 'covering_unit_id': qb => qb.select('id', 'unit_name') }
      ]
    });

    if (!itemVariants) {
      return res.success({ success: true, item_variants: [] });
    }

    const itemVariantsJSON = itemVariants.toJSON();

    const allAttributeIds = new Set();
    const allVariantIds = new Set();
    const allLogisticIds = new Set();
    const itemVariantIds = [];
    const masterProductIds = [];

    itemVariantsJSON.forEach(variant => {
      itemVariantIds.push(variant.id);

      const masterId = variant.item_id?.master_product_id;
      if (masterId) masterProductIds.push(masterId);

      const attrIds = typeof variant.attribute_ids === 'string'
        ? variant.attribute_ids.split(',').map(id => parseInt(id.trim(), 10))
        : (variant.attribute_ids || []);
      const varIds = typeof variant.variants_ids === 'string'
        ? variant.variants_ids.split(',').map(id => parseInt(id.trim(), 10))
        : (variant.variants_ids || []);
      const logIds = typeof variant.logistic_area_and_price_ids === 'string'
        ? variant.logistic_area_and_price_ids.split(',').map(id => parseInt(id.trim(), 10))
        : (variant.logistic_area_and_price_ids || []);

      attrIds.forEach(id => allAttributeIds.add(id));
      varIds.forEach(id => allVariantIds.add(id));
      logIds.forEach(id => allLogisticIds.add(id));
    });

    const [prices, stocks, attributesData, variantsData, assignedData, masterProducts] = await Promise.all([
      Item_Variants_price.query(qb => qb.whereIn('item_variants_id', itemVariantIds)).fetchAll({ require: false }),
      Item_Variants_stock.query(qb => qb.whereIn('item_variants_id', itemVariantIds)).fetchAll({ require: false }),
      Attributes.query(qb => qb.whereIn('id', Array.from(allAttributeIds))).fetchAll({ require: false }),
      Variants.query(qb => qb.whereIn('id', Array.from(allVariantIds))).fetchAll({ require: false }),
      Assigned.query(qb => qb.whereIn('id', Array.from(allLogisticIds))).fetchAll({ require: false }),
      MasterProduct.query(qb => qb.whereIn('id', masterProductIds)).fetchAll({ require: false })
    ]);

    const gstIds = masterProducts.toJSON().map(mp => mp.gst_id).filter(Boolean);
    const gstDetails = await Gst.query(qb => qb.whereIn('id', gstIds)).fetchAll({ require: false });

    const attributesMap = {};
    const variantsMap = {};
    const assignedMap = {};
    const logisticMap = {};
    const pricesMap = {};
    const stocksMap = {};
    const masterProductMap = {};
    const gstMap = {};

    attributesData.toJSON().forEach(attr => {
      attributesMap[attr.id] = { id: attr.id, attribute_name: attr.attribute_name };
    });

    variantsData.toJSON().forEach(variant => {
      variantsMap[variant.id] = { id: variant.id, variant: variant.variant };
    });

    const logisticAreaIds = assignedData.toJSON().map(entry => entry.Logistic_area_id).filter(id => !!id);
    const logisticAreas = await Logistic.query(qb => {
      qb.whereIn('id', logisticAreaIds);
    }).fetchAll({ require: false });

    logisticAreas.toJSON().forEach(area => {
      logisticMap[area.id] = {
        id: area.id,
        name: area.name,
        demographic_include: area.demographic_include,
        demographic_includes_id: area.demographic_includes_id
      };
    });

    assignedData.toJSON().forEach(assigned => {
      assignedMap[assigned.id] = {
        id: assigned.id,
        price: assigned.price,
        Logistic_area_id: assigned.Logistic_area_id,
        logistic_area: logisticMap[assigned.Logistic_area_id] || null
      };
    });

    prices.toJSON().forEach(price => {
      if (!pricesMap[price.item_variants_id]) {
        pricesMap[price.item_variants_id] = [];
      }
      pricesMap[price.item_variants_id].push(price);
    });


    stocks.toJSON().forEach(stock => {
      stocksMap[stock.item_variants_id] = stock;
    });

    masterProducts.toJSON().forEach(mp => {
      masterProductMap[mp.id] = { id: mp.id, gst_id: mp.gst_id };
    });

    gstDetails.toJSON().forEach(gst => {
      gstMap[gst.id] = { id: gst.id, gst_percent: gst.gst_percent, gst_name: gst.gst_name, taxablity_type: gst.taxablity_type };
    });

    const enrichedVariants = [];

    for (const variant of itemVariantsJSON) {
      const attrIds = typeof variant.attribute_ids === 'string'
        ? variant.attribute_ids.split(',').map(id => parseInt(id.trim(), 10))
        : (variant.attribute_ids || []);
      const varIds = typeof variant.variants_ids === 'string'
        ? variant.variants_ids.split(',').map(id => parseInt(id.trim(), 10))
        : (variant.variants_ids || []);
      const logIds = typeof variant.logistic_area_and_price_ids === 'string'
        ? variant.logistic_area_and_price_ids.split(',').map(id => parseInt(id.trim(), 10))
        : (variant.logistic_area_and_price_ids || []);

      const master = masterProductMap[variant.item_id?.master_product_id];
      const gstDetail = master ? gstMap[master.gst_id] : null;

      let productImage = null;
      if (variant.item_id?.id) {
        const attachment = await Attachments.where({
          entity_id: variant.item_id.id,
          entity_type: 'product_image',
          active_status: constants.activeStatus.active
        }).fetch({ require: false });

        if (attachment) {
          productImage = processAttachment(attachment.toJSON());
        }
      }

      const variantPrices = pricesMap[variant.id] || [];
      const formattedPrices = {};
      variantPrices.forEach(price => {
        const prefix = price.item_delivery_type === 'ex' ? 'ex_' :
          price.item_delivery_type === 'for' ? 'for_' : '';
        if (prefix) {
          Object.entries(price).forEach(([key, value]) => {
            if (key !== 'item_delivery_type' && key !== 'item_variants_id' && key !== 'id') {
              formattedPrices[`${prefix}${key}`] = value;
            }
          });
        }
      });
      enrichedVariants.push({
        ...variant,
        ...formattedPrices,
        item_variant_stock: stocksMap[variant.id] || {},
        attributes: attrIds.map(id => attributesMap[id] || {}).filter(attr => attr.id),
        variants: varIds.map(id => variantsMap[id] || {}).filter(v => v.id),
        logistic_area_and_prices: logIds.map(id => assignedMap[id] || {}).filter(a => a.id),
        gst_percent: gstDetail?.gst_percent || null,
        gst_name: gstDetail?.gst_name || null,
        taxablity_type: gstDetail?.taxablity_type || null,
        product_image: productImage
      });
    }



    return res.status(200).json({
      success: true,
      item_variants: enrichedVariants
    });

  } catch (error) {
    console.error(" Error occurred:", error);
    return res.status(500).json({
      success: false,
      error: ErrorHandler(error),
    });
  }
};
