'use strict';

const ProductChildCategory = require('../../../../../models/Product_child_category');
const { ErrorHandler, uploadImage, processAttachment } = require('../../../../../lib/utils');
const Attachment = require('../../../../../models/attachments');
const { uploadToS3Bucket, getObjectUrl } = require('../../../../../lib/utils/aws/s3');
const generateObjectKey = require('../../../../../lib/utils/aws/s3/generateObjectKey');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    let { product_child_category } = req.body;

    try {
      product_child_category = JSON.parse(product_child_category);
    } catch (err) {
      return res.serverError(400, ErrorHandler('Invalid JSON format in product_child_category data.'));
    }


    if (!product_child_category.id) {
      return res.serverError(400, ErrorHandler('Missing required field: id.'));
    }


    let existingChildCategory = await ProductChildCategory.where({ id: product_child_category.id }).fetch({ require: false });

    if (!existingChildCategory) {
      return res.serverError(400, ErrorHandler('Product Sub-product_child_category not found.'));
    }


    if (Object.keys(product_child_category).length > 1) {
      await existingChildCategory.save(product_child_category, { patch: true });
    }

    let child_category_image = null;
    if (req.files?.child_category_image) {
      const file = req.files.child_category_image[0];

      if (file) {

        const existingAttachment = await Attachment.where({
          entity_id: product_child_category.id,
          entity_type: 'child_category_image',
          active_status: constants.activeStatus.active
        }).fetch({ require: false });

        if (existingAttachment) {
          existingAttachment.set('active_status', constants.activeStatus.inactive);
          await existingAttachment.save();
        }

        const objectKey = generateObjectKey("child_category_image", file.originalname);
        await uploadToS3Bucket(objectKey, file.buffer);
        child_category_image = await getObjectUrl(objectKey);

        await new Attachment({
          entity_id: product_child_category.id,
          entity_type: 'child_category_image',
          photo_path: child_category_image,
          added_by: req.user.id
        }).save();
      }
    }

    const updatedSubCategory = await ProductChildCategory.where({ id: product_child_category.id }).fetch({
      require: false,
      withRelated: ['child_category_image'],
    });

    let subCategoryData = updatedSubCategory.toJSON();
    subCategoryData.child_category_image = processAttachment(subCategoryData.child_category_image);

    return res.success({ product_child_category: subCategoryData });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
