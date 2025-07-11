
'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const ProductSubCategory = require('../../../../../models/product_sub_category');
const ProductChildCategory = require('../../../../../models/Product_child_category');
const MasterProduct = require('../../../../../models/master_product');
const Product = require('../../../../../models/product');
const ItemVariants = require('../../../../../models/item_variants'); // Import Item_Variants model
const { constants } = require('../../../../../config');
const Attachments = require('../../../../../models/attachments');
const { processAttachment } = require('../../../../../lib/utils');

module.exports = async (req, res, next) => {
  try {
    // Fetch product sub-categories based on Product_category_id
    const product_sub_category = await ProductSubCategory.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ id: req.params.id })
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      columns: ['id', 'product_sub_category_name']
    });

    if (!product_sub_category || product_sub_category.length === 0) {
      return res.serverError(400, 'Invalid product_sub_category');
    }

    // Extract product_sub_category IDs
    const subCategoryIds = product_sub_category.map(sub => sub.id);

    // Fetch product child categories based on product_sub_category IDs
    const product_child_category = await ProductChildCategory.query((qb) => {
      qb.whereIn('Product_sub_category_id', subCategoryIds)
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      columns: ['id', 'product_child_category_name', 'Product_sub_category_id']
    });

    // Extract product_child_category IDs
    const childCategoryIds = product_child_category.map(child => child.id);

    // Fetch master products based on product_child_category IDs
    const master_products = await MasterProduct.query((qb) => {
      qb.whereIn('product_child_category_id', childCategoryIds)
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      columns: ['id', 'product_name', 'product_child_category_id']
    });

    // Convert collections to JSON
    const subCategories = product_sub_category.toJSON();
    const childCategories = product_child_category.toJSON();
    const masterProducts = master_products.toJSON();

    // Extract master product IDs for the next query
    const masterProductIds = masterProducts.map(mp => mp.id);

    // Fetch products from the Product model where master_product_id matches
    const productsQuery = await Product.query((qb) => {
      qb.whereIn('master_product_id', masterProductIds)
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,

      columns: ['id', 'product_name', 'brands_id', 'marketers_id', 'master_product_id']
    });

    const productData = productsQuery.toJSON();
    for (const prod of productData) {
      let attachments = await Attachments.where({
        entity_id: prod.id,
        entity_type: 'product_image', // Ensure this is correct as per your DB
        active_status: constants.activeStatus.active
      }).fetchAll({ require: false });

      let productImages = [];

      if (attachments && attachments.length > 0) {
        for (const attachment of attachments.toJSON()) {
          const image_url = processAttachment(attachment); // Function to extract image URL
          productImages.push(image_url);
        }

        // **Assign only the first image URL (String)**
        prod.product_images = productImages[0] || '';  // If no images, empty string
      } else {
        prod.product_images = ''; // If no attachments found, empty string
      }
    }


    // Extract product IDs for fetching item variants
    const productIds = productData.map(prod => prod.id);

    // Fetch item variants from Item_Variants model where item_id (product_id) matches
    const itemVariantsQuery = await ItemVariants.query((qb) => {
      qb.whereIn('item_id', productIds)
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      columns: ['id', 'variant_name', 'item_id']
    });

    const itemVariantsData = itemVariantsQuery.toJSON();

    // Track variants to prevent duplicates across products with same brands_id & master_product_id
    const variantTracker = {};

    // Structure response
    const formattedResponse = subCategories.map(sub => ({
      id: sub.id,
      product_sub_category_name: sub.product_sub_category_name,
      product_child_category: childCategories
        .filter(child => child.Product_sub_category_id === sub.id)
        .map(child => ({
          id: child.id,
          product_child_category_name: child.product_child_category_name,
          master_products: masterProducts
            .filter(mp => mp.product_child_category_id === child.id)
            .map(mp => ({
              id: mp.id,
              product_name: mp.product_name,
              products: productData
                .filter(prod => prod.master_product_id === mp.id)
                .map(prod => {
                  const productKey = `${prod.brands_id}_${prod.master_product_id}`;

                  if (!variantTracker[productKey]) {
                    variantTracker[productKey] = new Set();
                  }

                  const filteredVariants = itemVariantsData
                    .filter(variant => variant.item_id === prod.id)
                    .filter(variant => {
                      if (variantTracker[productKey].has(variant.variant_name)) {
                        return false; // Ignore duplicate variant name
                      }
                      variantTracker[productKey].add(variant.variant_name);
                      return true;
                    });

                  return {
                    id: prod.id,
                    product_name: prod.product_name,
                    brands_id: prod.brands_id,
                    master_product_id: prod.master_product_id,
                    product_images: prod.product_images,
                    item_variants: filteredVariants
                  };
                })
            }))
        }))
    }));

    return res.success({
      success: true,
      product_sub_category: formattedResponse
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
