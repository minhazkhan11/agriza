'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Item_Variants = require('../../../../../models/item_variants');
const Item_Variants_price = require('../../../../../models/item_variants_price');
const Item_Variants_stock = require('../../../../../models/item_variants_stock');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
    try {
        const itemVariantId = parseInt(req.params.id, 10);
        if (isNaN(itemVariantId)) {
            return res.serverError(400, ErrorHandler(new Error('Invalid Item Variant ID')));
        }

        // **Check if Item_Variants exists**
        let check = await Item_Variants.where({ id: itemVariantId }).fetch({ require: false });
        if (!check) {
            return res.serverError(400, ErrorHandler(new Error('Item Variant Not Found')));
        }

        // **Soft Delete Item_Variants**
        await new Item_Variants().where({ id: itemVariantId }).save(
            { active_status: constants.activeStatus.deleted },
            { method: 'update' }
        );

        // **Soft Delete Related Item_Variants_price**
        await new Item_Variants_price().where({ item_variants_id: itemVariantId }).save(
            { active_status: constants.activeStatus.deleted },
            { method: 'update' }
        );

        // **Soft Delete Related Item_Variants_stock**
        await new Item_Variants_stock().where({ item_variants_id: itemVariantId }).save(
            { active_status: constants.activeStatus.deleted },
            { method: 'update' }
        );

        return res.success({ message: 'Item Variant and related data deleted successfully' });

    } catch (error) {
        console.error('Error:', error);
        return res.serverError(500, ErrorHandler(error));
    }
};
