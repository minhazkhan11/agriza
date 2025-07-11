
'use strict';
const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
const Product = require('../../../../../models/product');
const { constants } = require('../../../../../config');
const Attachments = require('../../../../../models/attachments');
const Units = require('../../../../../models/units');

module.exports = async (req, res, next) => {
    try {
        const product = await Product.query((qb) => {
            qb.whereIn('active_status', [
                constants.activeStatus.active,
                constants.activeStatus.inactive,
                constants.activeStatus.pending
            ])
                .andWhere({ id: req.params.id })
                .orderBy('created_at', 'asc');
        }).fetch({
            require: false,
            withRelated: [
                {
                    'product_category_id': function (query) {
                        query.select('id', 'category_name');
                    }
                },
                {
                    'product_class_id': function (query) {
                        query.select('id', 'class_name');
                    }
                },
                {
                    'product_sub_category_id': function (query) {
                        query.select('id', 'product_sub_category_name');
                    }
                },
                {
                    'brands_id': function (query) {
                        query.select('id', 'brand_name');
                    }
                },
                {
                    'marketers_id': function (query) {
                        query.select('id', 'marketer_name', 'alias_name');
                    }
                },
                {
                    'product_child_category_id': function (query) {
                        query.select('id', 'product_child_category_name');
                    }
                },
                {
                    'master_product_id': function (query) {
                        query.select('id', 'product_name');
                    }
                }
            ],
        });

        if (!product) return res.serverError(400, 'Invalid product');

        let productData = product.toJSON();
        productData.product_image = null; // Default value

        // **Fetch Attachments**
        let attachments = await Attachments.where({
            entity_id: product.id,
            entity_type: 'product_image',
            active_status: constants.activeStatus.active
        }).fetchAll({ require: false });

        if (attachments && attachments.length > 0) {
            let firstAttachment = attachments.toJSON()[0]; // First Image Only
            productData.product_image = processAttachment(firstAttachment);
        }

        // **Fetch Unit Details (Primary, Secondary, Covering)**
        const fetchUnit = async (unitId) => {
            if (!unitId || isNaN(unitId) || unitId.toString().trim() === "") return null;
            const unit = await Units.where({ id: parseInt(unitId, 10) })
                .fetch({ require: false, columns: ['id', 'unit_name'] });
            return unit ? unit.toJSON() : null;
        };

        productData.primary_unit = await fetchUnit(productData.primary_unit_id);
        productData.secondary_unit = await fetchUnit(productData.secondary_unit_id);
        productData.covering_unit = await fetchUnit(productData.covering_unit_id);

        // **Remove Unnecessary Fields**
        delete productData.primary_unit_id;
        delete productData.secondary_unit_id;
        delete productData.covering_unit_id;

        return res.success({ product: productData });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
