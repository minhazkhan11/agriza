
'use strict';

const ProductSubCategory = require('../../../../../models/product_sub_category');
const Attachment = require('../../../../../models/attachments');
const { ErrorHandler, uploadImage, processAttachment } = require('../../../../../lib/utils');
const { uploadToS3Bucket, getObjectUrl } = require('../../../../../lib/utils/aws/s3');
const generateObjectKey = require('../../../../../lib/utils/aws/s3/generateObjectKey');
const { constants } = require('../../../../../config');


module.exports = async (req, res, next) => {
  try {
    let { product_sub_category } = req.body;
    try {
      product_sub_category = JSON.parse(product_sub_category);
    } catch (err) {
      return res.serverError(400, ErrorHandler('Invalid JSON format in product_sub_category data.'));
    }

    if (!product_sub_category.id) {
      return res.serverError(400, ErrorHandler('Missing required field: id.'));
    }
    let existingSubCategory = await ProductSubCategory.where({ id: product_sub_category.id }).fetch({ require: false });
    if (!existingSubCategory) {
      return res.serverError(400, ErrorHandler('Product Sub-Category not found.'));
    }
    if (Object.keys(product_sub_category).length > 1) {
      await existingSubCategory.save(product_sub_category, { patch: true });
    }


    let sub_category_image = null;

    if (req.files?.sub_category_image?.[0]) {
      const file = req.files.sub_category_image[0];
      const existingAttachment = await Attachment.where({
        entity_id: product_sub_category.id,
        entity_type: 'sub_category_image',
        active_status: constants.activeStatus.active
      }).fetch({ require: false });

      if (existingAttachment) {
        existingAttachment.set('active_status', constants.activeStatus.inactive);
        await existingAttachment.save();
      }

      // Step 2: Upload the new image
      const objectKey = generateObjectKey("sub_category_image", file.originalname);
      await uploadToS3Bucket(objectKey, file.buffer);
      sub_category_image = await getObjectUrl(objectKey);

      await new Attachment({
        entity_id: existingSubCategory.id,
        entity_type: 'sub_category_image',
        photo_path: sub_category_image,
        added_by: req.user.id
      }).save();
    }

    // Fetch the updated sub-category including the image
    const updatedSubCategory = await ProductSubCategory.where({ id: product_sub_category.id }).fetch({
      require: false,
      withRelated: ['sub_category_image'],
    });

    let subCategoryData = updatedSubCategory.toJSON();
    subCategoryData.sub_category_image = processAttachment(subCategoryData.sub_category_image);

    return res.success({ product_sub_category: subCategoryData });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};




// 'use strict';
// const ProductsubCategory = require('../../../../../models/product_sub_category')
// const { ErrorHandler } = require('../../../../../lib/utils');
// const { constants } = require('../../../../../config');
// module.exports = async (req, res, next) => {
//   try {

//     const id = req.body.product_sub_category.id;
//     let Check = await ProductsubCategory.where({ id }).fetch({ require: false });
//     if (!Check)
//       return res.serverError(400, ErrorHandler('Data not found'));


//     const body = req.body.product_sub_category
//     const data = await new ProductsubCategory().where({ id }).save(body, { method: 'update' });

//     const newproduct_sub_category = await ProductsubCategory.where({ id }).fetch({ require: false });

//     return res.success({ product_sub_category: newproduct_sub_category });
//   } catch (error) {
//     return res.serverError(500, ErrorHandler(error));
//   }
// };

