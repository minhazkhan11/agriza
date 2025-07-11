'use strict';
const ProductCategory = require('../../../../../models/product_category');
const ProductSubCategory = require('../../../../../models/product_sub_category');
const ProductChildCategory = require('../../../../../models/Product_child_category'); 
const Product = require('../../../../../models/product');
const Attachments = require('../../../../../models/attachments');
const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
const constants = require('../../../../../config/constants'); 

module.exports = async (req, res, next) => {
  try {
    // ✅ Fetch subcategories based on category ID
    const subCategories = await ProductSubCategory.where({
      Product_category_id: 1,
      active_status: 'active'
    }).fetchAll({ require: false, columns: ['id', 'product_sub_category_name'] });

    let childCategoryArray = [];

    for (const subCategory of subCategories.toJSON()) {
      // ✅ Fetch child categories for each subcategory
      const childCategories = await ProductChildCategory.where({ 
        Product_sub_category_id: 1,
        active_status: 'active'
      }).fetchAll({ require: false, columns: ['id', 'product_child_category_name'] });

      for (const childCategory of childCategories.toJSON()) {
        let childCategoryJson = {
          child_category_name: childCategory.product_child_category_name,
          products: [] 
        };

        // ✅ Fetch 8 random products
        const products = await Product.query((qb) => {
          qb.where({ product_child_category_id: childCategory.id, active_status: 'active' })
            .limit(5);
        }).fetchAll({ require: false });

        let productData = products.toJSON(); 

        // ✅ Fetch images for all products in parallel
        const productWithImages = await Promise.all(
          productData.map(async (product) => {
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

        childCategoryJson.products = productWithImages; 
        childCategoryArray.push(childCategoryJson); 
      }
    }

    return res.success({
      seeds_product: childCategoryArray.slice(0, 4) 
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
