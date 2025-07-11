

'use strict';

const ProductSubCategory = require('../../../../../models/product_sub_category');
const Attachment = require('../../../../../models/attachments');
const { ErrorHandler, uploadImage, processAttachment } = require('../../../../../lib/utils');

module.exports = async (req, res) => {
  try {
    let { product_sub_category } = req.body;

    // Safely Parse JSON if product_sub_category is a string
    try {
      product_sub_category = JSON.parse(product_sub_category);
    } catch (err) {
      return res.serverError(400, ErrorHandler('Invalid JSON format in product_sub_category data.'));
    }

    // Validate required fields
    if (!product_sub_category.product_sub_category_name) {
      return res.serverError(400, ErrorHandler('Missing required fields: product_sub_category_name.'));
    }

    product_sub_category.added_by = req.user.id;

    // Check if sub-category already exists
    const existingSubCategory = await ProductSubCategory.query((qb) => {
      qb.where('product_sub_category_name', product_sub_category.product_sub_category_name)
        .whereIn('active_status', ['active', 'inactive']);
    }).fetch({ require: false });

    let savedSubCategory;
    if (existingSubCategory) {
      // Update existing sub-category
      await existingSubCategory.save(product_sub_category, { patch: true });
      savedSubCategory = existingSubCategory;
    } else {
      // Insert new sub-category
      savedSubCategory = await new ProductSubCategory(product_sub_category).save();
    }

    // Attachments processing (Sub-Category Image)
    const attachments = [{ key: "sub_category_image", type: "sub_category_image" }];

    for (const attachment of attachments) {
      const file = req.files?.[attachment.key]?.[0] || null;

      if (file) {
        // Check if an existing attachment is present
        const existingAttachment = await Attachment.where({
          entity_id: savedSubCategory.id,
          entity_type: attachment.type,
        }).fetch({ require: false });

        if (existingAttachment) {
          // Delete old attachment record
          await existingAttachment.destroy();
        }

        // Upload the new file and save it
        await uploadImage(
          file,
          "product_sub_categories",
          "sub_category",
          savedSubCategory.id, // Uploading into ProductSubCategory model
          attachment.type,
          req.user.id
        );
      }
    }

    // Fetch updated sub-category details with uploaded attachments
    const updatedSubCategory = await ProductSubCategory.where({ id: savedSubCategory.id }).fetch({
      require: false,
      withRelated: ['sub_category_image'],
    });

    // Process attachment URLs
    const subCategoryData = updatedSubCategory.toJSON();
    subCategoryData.sub_category_image = processAttachment(subCategoryData.sub_category_image);

    return res.success({ product_sub_category: subCategoryData });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
