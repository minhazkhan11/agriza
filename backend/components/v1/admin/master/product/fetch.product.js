'use strict';
const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
const Product = require('../../../../../models/product');
const { constants } = require('../../../../../config');
const Attachments = require('../../../../../models/attachments');
const Units = require('../../../../../models/units');


module.exports = async (req, res, next) => {
    try {
        const products = await Product.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive, constants.activeStatus.cancelled, constants.activeStatus.pending])
                .andWhere('added_by', req.user.id)
                .orderBy('created_at', 'asc');
        }).fetchAll({
            require: false,
            withRelated: [
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

        let newProduct = [];

        for (const product of products) {
            let productData = product.toJSON();
            productData.product_image = null; // Default to null for single image

            // **Fetch Single Image Attachment**
            let attachment = await Attachments.where({
                entity_id: product.id,
                entity_type: 'product_image', // Updated entity type
                active_status: constants.activeStatus.active
            }).fetch({ require: false }); // Fetch only one record instead of fetchAll

            if (attachment) {
                productData.product_image = processAttachment(attachment.toJSON()); // Assign single image URL
            }

            newProduct.push(productData);
        }



        const count = newProduct.length;

        return res.success({
            newProduct, count
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};