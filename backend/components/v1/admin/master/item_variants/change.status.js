'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Item_Variants = require('../../../../../models/item_variants');
const Item_Variants_price = require('../../../../../models/item_variants_price');
const Item_Variants_stock = require('../../../../../models/item_variants_stock');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {

        const id = req.body.item_variants.id;
        const active_status = req.body.item_variants.active_status;

        let check = await Item_Variants.where({ id }).fetch({ require: false });
        if (!check) {
            return res.serverError(400, ErrorHandler('Item Variant not found'));
        }

        await new Item_Variants().where({ id }).save({ active_status }, { method: 'update' });


        await new Item_Variants_price().where({ item_variants_id: id }).save({ active_status }, { method: 'update' });

        await new Item_Variants_stock().where({ item_variants_id: id }).save({ active_status }, { method: 'update' });

        const updatedItemVariant = await Item_Variants.where({ id }).fetch({ require: false });
        const updatedPrice = await Item_Variants_price.where({ item_variants_id: id }).fetch({ require: false });
        const updatedStock = await Item_Variants_stock.where({ item_variants_id: id }).fetch({ require: false });

        return res.success({
            item_variants: updatedItemVariant,
            item_variant_price: updatedPrice || {},
            item_variant_stock: updatedStock || {}
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
