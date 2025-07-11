
// 'use strict';
// const { ErrorHandler } = require('../../../../../lib/utils');
// const Item_Variants = require('../../../../../models/item_variants');
// const Item_Variants_price = require('../../../../../models/item_variants_price');
// const Item_Variants_stock = require('../../../../../models/item_variants_stock');
// const Attributes = require('../../../../../models/attributes');
// const Variants = require('../../../../../models/variant');
// const Assigned = require('../../../../../models/item_varint_assigned_price_and_logistic_area');
// const Logistic = require('../../../../../models/logistic_area');
// const { constants } = require('../../../../../config');

// module.exports = async (req, res, next) => {
//     try {
//         const itemVariantId = parseInt(req.params.id, 10);
//         if (isNaN(itemVariantId)) {
//             return res.serverError(400, 'Invalid ID provided');
//         }

//         const itemVariant = await Item_Variants.query(qb => {
//             qb.whereIn('active_status', [
//                 constants.activeStatus.active,
//                 constants.activeStatus.inactive
//             ])
//                 .andWhere('id', itemVariantId)
//                 .orderBy('created_at', 'asc');
//         }).fetch({
//             require: false, withRelated: [
//                 { 'item_id': qb => qb.select('id', 'product_name') },
//                 { 'primary_unit_id': qb => qb.select('id', 'unit_name') },
//                 { 'secondary_unit_id': qb => qb.select('id', 'unit_name') },
//                 { 'covering_unit_id': qb => qb.select('id', 'unit_name') }
//             ]
//         });

//         if (!itemVariant) {
//             return res.serverError(400, 'Invalid Item_Variants');
//         }

//         let item_variants = itemVariant.toJSON();

//         const itemVariantPrice = await Item_Variants_price.query(qb => {
//             qb.where('item_variants_id', itemVariantId);
//         }).fetchAll({ require: false });


//         const itemVariantStock = await Item_Variants_stock.where('item_variants_id', itemVariantId)
//             .fetch({ require: false });

//         let attributeIds = item_variants.attribute_ids || [];
//         let variantsIds = item_variants.variants_ids || [];
//         let logistic_area_and_price = item_variants.logistic_area_and_price_ids || [];

//         if (typeof attributeIds === 'string') {
//             attributeIds = attributeIds.split(',').map(id => parseInt(id.trim(), 10));
//         }
//         if (typeof variantsIds === 'string') {
//             variantsIds = variantsIds.split(',').map(id => parseInt(id.trim(), 10));
//         }
//         if (typeof logistic_area_and_price === 'string') {
//             logistic_area_and_price = logistic_area_and_price.split(',').map(id => parseInt(id.trim(), 10));
//         }

//         const attributesData = await Attributes.query(qb => {
//             qb.whereIn('id', attributeIds);
//         }).fetchAll({ require: false });

//         const variantsData = await Variants.query(qb => {
//             qb.whereIn('id', variantsIds);
//         }).fetchAll({ require: false });

//         const assignedData = await Assigned.query(qb => {
//             qb.whereIn('id', logistic_area_and_price);
//         }).fetchAll({ require: false });

//         const logisticAreaIds = assignedData.toJSON()
//             .map(entry => entry.Logistic_area_id)
//             .filter(id => !!id);

//         const logisticAreas = await Logistic.query(qb => {
//             qb.whereIn('id', logisticAreaIds);
//         }).fetchAll({ require: false });

//         const attributesMap = {};
//         const variantsMap = {};
//         const assignedMap = {};
//         const logisticMap = {};

//         attributesData.toJSON().forEach(attr => {
//             attributesMap[attr.id] = { id: attr.id, attribute_name: attr.attribute_name };
//         });

//         variantsData.toJSON().forEach(variant => {
//             variantsMap[variant.id] = { id: variant.id, variant: variant.variant };
//         });

//         logisticAreas.toJSON().forEach(area => {
//             logisticMap[area.id] = {
//                 id: area.id,
//                 name: area.name,
//                 demographic_include: area.demographic_include,
//                 demographic_includes_id: area.demographic_includes_id
//             };
//         });

//         assignedData.toJSON().forEach(assigned => {
//             assignedMap[assigned.id] = {
//                 id: assigned.id,
//                 price: assigned.price,
//                 Logistic_area_id: assigned.Logistic_area_id,
//                 logistic_area: logisticMap[assigned.Logistic_area_id] || null
//             };
//         });
//         return res.success({
//             success: true,
//             item_variants: {
//                 ...item_variants,
//                 item_variant_price: itemVariantPrice ? itemVariantPrice.toJSON() : [],
//                 item_variant_stock: itemVariantStock ? itemVariantStock.toJSON() : {},
//                 attributes: attributeIds.map(id => attributesMap[id] || {}).filter(attr => attr.id),
//                 variants: variantsIds.map(id => variantsMap[id] || {}).filter(variant => variant.id),
//                 logistic_area_and_prices: logistic_area_and_price
//                     .map(id => assignedMap[id] || {})
//                     .filter(assigned => assigned.id)
//             }
//         });

//     } catch (error) {
//         return res.serverError(500, ErrorHandler(error));
//     }
// };

'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Item_Variants = require('../../../../../models/item_variants');
const Item_Variants_price = require('../../../../../models/item_variants_price');
const Item_Variants_stock = require('../../../../../models/item_variants_stock');
const Attributes = require('../../../../../models/attributes');
const Variants = require('../../../../../models/variant');
const Assigned = require('../../../../../models/item_varint_assigned_price_and_logistic_area');
const Logistic = require('../../../../../models/logistic_area');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        const itemVariantId = parseInt(req.params.id, 10);
        if (isNaN(itemVariantId)) {
            return res.serverError(400, 'Invalid ID provided');
        }

        const itemVariant = await Item_Variants.query(qb => {
            qb.whereIn('active_status', [
                constants.activeStatus.active,
                constants.activeStatus.inactive
            ])
                .andWhere('id', itemVariantId)
                .orderBy('created_at', 'asc');
        }).fetch({
            require: false, withRelated: [
                { 'item_id': qb => qb.select('id', 'product_name') },
                { 'primary_unit_id': qb => qb.select('id', 'unit_name') },
                { 'secondary_unit_id': qb => qb.select('id', 'unit_name') },
                { 'covering_unit_id': qb => qb.select('id', 'unit_name') }
            ]
        });

        if (!itemVariant) {
            return res.serverError(400, 'Invalid Item_Variants');
        }

        let item_variants = itemVariant.toJSON();

        const itemVariantPrice = await Item_Variants_price.query(qb => {
            qb.where('item_variants_id', itemVariantId);
        }).fetchAll({ require: false });


        const itemVariantStock = await Item_Variants_stock.where('item_variants_id', itemVariantId)
            .fetch({ require: false });

        let attributeIds = item_variants.attribute_ids || [];
        let variantsIds = item_variants.variants_ids || [];
        let logistic_area_and_price = item_variants.logistic_area_and_price_ids || [];

        if (typeof attributeIds === 'string') {
            attributeIds = attributeIds.split(',').map(id => parseInt(id.trim(), 10));
        }
        if (typeof variantsIds === 'string') {
            variantsIds = variantsIds.split(',').map(id => parseInt(id.trim(), 10));
        }
        if (typeof logistic_area_and_price === 'string') {
            logistic_area_and_price = logistic_area_and_price.split(',').map(id => parseInt(id.trim(), 10));
        }

        const attributesData = await Attributes.query(qb => {
            qb.whereIn('id', attributeIds);
        }).fetchAll({ require: false });

        const variantsData = await Variants.query(qb => {
            qb.whereIn('id', variantsIds);
        }).fetchAll({ require: false });

        const assignedData = await Assigned.query(qb => {
            qb.whereIn('id', logistic_area_and_price);
        }).fetchAll({ require: false });

        const logisticAreaIds = assignedData.toJSON()
            .map(entry => entry.Logistic_area_id)
            .filter(id => !!id);

        const logisticAreas = await Logistic.query(qb => {
            qb.whereIn('id', logisticAreaIds);
        }).fetchAll({ require: false });

        const attributesMap = {};
        const variantsMap = {};
        const assignedMap = {};
        const logisticMap = {};

        attributesData.toJSON().forEach(attr => {
            attributesMap[attr.id] = { id: attr.id, attribute_name: attr.attribute_name };
        });

        variantsData.toJSON().forEach(variant => {
            variantsMap[variant.id] = { id: variant.id, variant: variant.variant };
        });

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
        // Prepare prefixed price fields
        const formattedPrices = {};
        if (itemVariantPrice && itemVariantPrice.length > 0) {
            itemVariantPrice.toJSON().forEach(price => {
                const prefix = price.item_delivery_type === 'ex' ? 'ex_' :
                    price.item_delivery_type === 'for' ? 'for_' : '';
                if (prefix) {
                    Object.entries(price).forEach(([key, value]) => {
                        if (key !== 'item_delivery_type') {
                            formattedPrices[`${prefix}${key}`] = value;
                        }
                    });
                }
            });
        }

        // Final response
        return res.success({
            success: true,
            item_variants: {
                ...item_variants,
                ...formattedPrices,
                item_variant_stock: itemVariantStock ? itemVariantStock.toJSON() : {},
                attributes: attributeIds.map(id => attributesMap[id] || {}).filter(attr => attr.id),
                variants: variantsIds.map(id => variantsMap[id] || {}).filter(variant => variant.id),
                logistic_area_and_prices: logistic_area_and_price
                    .map(id => assignedMap[id] || {})
                    .filter(assigned => assigned.id)
            }
        });


    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
