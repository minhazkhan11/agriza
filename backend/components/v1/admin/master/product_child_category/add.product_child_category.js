

'use strict';

const ProductChildCategory = require('../../../../../models/Product_child_category');
const Attachment = require('../../../../../models/attachments');
const { ErrorHandler, uploadImage, processAttachment } = require('../../../../../lib/utils');
const { uploadToS3Bucket, getObjectUrl } = require('../../../../../lib/utils/aws/s3');
const generateObjectKey = require('../../../../../lib/utils/aws/s3/generateObjectKey')


module.exports = async (req, res) => {
  try {
    let { product_child_category } = req.body;
    try {
      product_child_category = JSON.parse(product_child_category);
    } catch (err) {
      return res.serverError(400, ErrorHandler('Invalid JSON format in product_child_category data.'));
    }

    if (!product_child_category.product_child_category_name) {
      return res.serverError(400, ErrorHandler('Missing required fields: product_child_category_name.'));
    }

    product_child_category.added_by = req.user.id;
    const existingSubCategory = await ProductChildCategory.query((qb) => {
      qb.where('product_child_category_name', product_child_category.product_child_category_name)
        .whereIn('active_status', ['active', 'inactive']);
    }).fetch({ require: false });

    let savedChildCategory;
    if (existingSubCategory) {
      await existingSubCategory.save(product_child_category, { patch: true });
      savedChildCategory = existingSubCategory;
    } else {
      savedChildCategory = await new ProductChildCategory(product_child_category).save();
    }



    let child_category_image = null;

    if (req.files?.child_category_image?.[0]) {
      const file = req.files.child_category_image[0];
      const objectKey = generateObjectKey("child_category_image", file.originalname);
      await uploadToS3Bucket(objectKey, file.buffer);
      child_category_image = await getObjectUrl(objectKey);

      await new Attachment({
        entity_id: savedChildCategory.id,
        entity_type: 'child_category_image',
        photo_path: child_category_image,
        added_by: req.user.id
      }).save();
    }
    // Fetch updated sub-category details with uploaded attachments
    const updatedSubCategory = await ProductChildCategory.where({ id: savedChildCategory.id }).fetch({
      require: false,
      withRelated: ['child_category_image'],
    });

    // Process attachment URLs
    const subCategoryData = updatedSubCategory.toJSON();
    subCategoryData.child_category_image = processAttachment(subCategoryData.child_category_image);

    return res.success({ product_child_category: subCategoryData });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
