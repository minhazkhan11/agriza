
// 'use strict';
// const { ErrorHandler } = require('../../../../../lib/utils');
// const Item_Variants = require('../../../../../models/item_variants');
// const Item_Variants_price = require('../../../../../models/item_variants_price');
// const Item_Variants_stock = require('../../../../../models/item_variants_stock');
// const Attributes = require('../../../../../models/attributes');
// const Variants = require('../../../../../models/variant');
// const { constants } = require('../../../../../config');

// module.exports = async (req, res, next) => {
//     try {
//         const itemVariants = await Item_Variants.query((qb) => {
//             qb.whereIn('active_status', [
//                 constants.activeStatus.active,
//                 constants.activeStatus.inactive
//             ])
//                 .orderBy('created_at', 'asc');
//         }).fetchAll({
//             require: false, withRelated: [
//                 { 'item_id': qb => qb.select('id', 'product_name') },
//                 { 'primary_unit_id': qb => qb.select('id', 'unit_name') },
//                 { 'secondary_unit_id': qb => qb.select('id', 'unit_name') },
//                 { 'covering_unit_id': qb => qb.select('id', 'unit_name') }
//             ]
//         });

//         if (!itemVariants) {
//             return res.success({ item_variants: [], count: 0 });
//         }

//         let itemVariantList = itemVariants.toJSON();

//         const itemVariantIds = itemVariantList.map(variant => variant.id);

//         const itemVariantPrices = await Item_Variants_price.query(qb => {
//             qb.whereIn('item_variants_id', itemVariantIds);
//         }).fetchAll({ require: false });

//         const itemVariantStocks = await Item_Variants_stock.query(qb => {
//             qb.whereIn('item_variants_id', itemVariantIds);
//         }).fetchAll({ require: false });

//         const pricesMap = {};
//         const stocksMap = {};

//         itemVariantPrices.toJSON().forEach(price => {
//             pricesMap[price.item_variants_id] = price;
//         });

//         itemVariantStocks.toJSON().forEach(stock => {
//             stocksMap[stock.item_variants_id] = stock;
//         });

//         let attributeIds = [];
//         let variantIds = [];

//         itemVariantList.forEach(variant => {
//             if (Array.isArray(variant.attribute_ids)) {
//                 attributeIds = [...attributeIds, ...variant.attribute_ids];
//             }
//             if (Array.isArray(variant.variants_ids)) {
//                 variantIds = [...variantIds, ...variant.variants_ids];
//             }
//         });

//         attributeIds = [...new Set(attributeIds)];
//         variantIds = [...new Set(variantIds)];

//         const attributesData = await Attributes.query(qb => {
//             qb.whereIn('id', attributeIds);
//         }).fetchAll({ require: false });

//         const variantsData = await Variants.query(qb => {
//             qb.whereIn('id', variantIds);
//         }).fetchAll({ require: false });

//         const attributesMap = {};
//         const variantsMap = {};

//         attributesData.toJSON().forEach(attr => {
//             attributesMap[attr.id] = { id: attr.id, attribute_name: attr.attribute_name };
//         });

//         variantsData.toJSON().forEach(variant => {
//             variantsMap[variant.id] = { id: variant.id, variant: variant.variant };
//         });

//         itemVariantList = itemVariantList.map(variant => ({
//             ...variant,
//             item_variant_price: pricesMap[variant.id] || {},
//             item_variant_stock: stocksMap[variant.id] || {},
//             attributes: variant.attribute_ids.map(id => attributesMap[id] || {}).filter(attr => attr.id),
//             variants: variant.variants_ids.map(id => variantsMap[id] || {}).filter(variant => variant.id)
//         }));

//         itemVariantList.forEach(variant => {
//             delete variant.attribute_ids;
//             delete variant.variants_ids;
//         });

//         return res.success({
//             item_variants: itemVariantList,
//             count: itemVariantList.length
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
        const itemVariants = await Item_Variants.query(qb => {
            qb.whereIn('active_status', [
                constants.activeStatus.active,
                constants.activeStatus.inactive
            ])
                .orderBy('created_at', 'asc');
        }).fetchAll({
            require: false,
            withRelated: [
                { 'item_id': qb => qb.select('id', 'product_name') },
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

        itemVariantsJSON.forEach(variant => {
            itemVariantIds.push(variant.id);

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

        const [prices, stocks, attributesData, variantsData, assignedData] = await Promise.all([
            Item_Variants_price.query(qb => qb.whereIn('item_variants_id', itemVariantIds)).fetchAll({ require: false }),
            Item_Variants_stock.query(qb => qb.whereIn('item_variants_id', itemVariantIds)).fetchAll({ require: false }),
            Attributes.query(qb => qb.whereIn('id', Array.from(allAttributeIds))).fetchAll({ require: false }),
            Variants.query(qb => qb.whereIn('id', Array.from(allVariantIds))).fetchAll({ require: false }),
            Assigned.query(qb => qb.whereIn('id', Array.from(allLogisticIds))).fetchAll({ require: false })
        ]);

        const logisticAreaIds = assignedData.toJSON().map(entry => entry.Logistic_area_id).filter(id => !!id);

        const logisticAreas = await Logistic.query(qb => {
            qb.whereIn('id', logisticAreaIds);
        }).fetchAll({ require: false });

        const attributesMap = {};
        const variantsMap = {};
        const assignedMap = {};
        const logisticMap = {};
        const pricesMap = {};
        const stocksMap = {};

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

        prices.toJSON().forEach(price => {
            pricesMap[price.item_variants_id] = price;
        });

        stocks.toJSON().forEach(stock => {
            stocksMap[stock.item_variants_id] = stock;
        });

        const enrichedVariants = itemVariantsJSON.map(variant => {
            const attrIds = typeof variant.attribute_ids === 'string'
                ? variant.attribute_ids.split(',').map(id => parseInt(id.trim(), 10))
                : (variant.attribute_ids || []);
            const varIds = typeof variant.variants_ids === 'string'
                ? variant.variants_ids.split(',').map(id => parseInt(id.trim(), 10))
                : (variant.variants_ids || []);
            const logIds = typeof variant.logistic_area_and_price_ids === 'string'
                ? variant.logistic_area_and_price_ids.split(',').map(id => parseInt(id.trim(), 10))
                : (variant.logistic_area_and_price_ids || []);

            return {
                ...variant,
                item_variant_price: pricesMap[variant.id] || {},
                item_variant_stock: stocksMap[variant.id] || {},
                attributes: attrIds.map(id => attributesMap[id] || {}).filter(attr => attr.id),
                variants: varIds.map(id => variantsMap[id] || {}).filter(variant => variant.id),
                logistic_area_and_prices: logIds.map(id => assignedMap[id] || {}).filter(assigned => assigned.id)
            };
        });

        return res.success({
            success: true,
            item_variants: enrichedVariants
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
