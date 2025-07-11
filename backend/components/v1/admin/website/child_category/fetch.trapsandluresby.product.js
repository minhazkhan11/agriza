'use strict';

const ProductSubCategory = require('../../../../../models/product_sub_category');
const Product = require('../../../../../models/product');
const Attachments = require('../../../../../models/attachments');
const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
const constants = require('../../../../../config/constants'); 

module.exports = async (req, res, next) => {
  try {
    // ✅ Fetch subcategories based on category ID
    const subCategories = await ProductSubCategory.where({
      id: 5,
      active_status: 'active'
    }).fetchAll({ require: false, columns: ['id', 'product_sub_category_name'] });

    if (!subCategories || subCategories.length === 0) {
      return res.success({ seeds_product: [] });
    }

    let subCategoryArray = subCategories.toJSON();
    let subCategoryIds = subCategoryArray.map(subCat => subCat.id); 

    // ✅ Fetch products
    const products = await Product.query(qb => {
      qb.whereIn('product_sub_category_id', subCategoryIds)
        .andWhere('active_status', 'active');
    }).fetchAll({ require: false });

    if (!products || products.length === 0) {
      return res.success({ product: [] });
    }

    let productArray = products.toJSON();

    // ✅ Fetch images for all products in parallel
    const productWithImages = await Promise.all(
      productArray.map(async (product) => {
        product.product_image = null; 

        // **Fetch Single Image Attachment**
        const attachment = await Attachments.where({
          entity_id: product.id,
          entity_type: 'product_image',
          active_status: constants.activeStatus.active
        }).fetch({ require: false });

        if (attachment) {
          product.product_image = processAttachment(attachment.toJSON());
        }

        return product;
      })
    );

    return res.success({
      product: productWithImages
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
