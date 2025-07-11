'use strict';

const { ErrorHandler, uploadImage, processAttachment } = require('../../../../../lib/utils');
const Product = require('../../../../../models/product');
const { uploadToS3Bucket, getObjectUrl } = require('../../../../../lib/utils/aws/s3');
const generateObjectKey = require('../../../../../lib/utils/aws/s3/generateObjectKey')
const Attachments = require('../../../../../models/attachments');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    // Ensure `body.product` is parsed correctly
    let body;
    if (typeof req.body.product === 'string') {
      body = JSON.parse(req.body.product);
    } else {
      return res.badRequest({ error: 'Invalid product data format' });
    }


    // Attach the user ID to the product data
    body.added_by = req.user.id;
    // Set default marketers_id if not provided
    body.marketers_id = body.marketers_id || null;
    body.product_child_category_id = body.product_child_category_id || null;
    body.product_sub_category_id = body.product_sub_category_id || null;
    body.secondary_unit_id = body.secondary_unit_id || null;
    body.primary_unit_id = body.primary_unit_id || null;
    body.brands_id = body.brands_id || null;
    body.gst_percent_id = body.gst_percent_id || null;
    body.product_class_id = body.product_class_id || null;
    body.product_category_id = body.product_category_id || null;
    body.covering_unit_id = body.covering_unit_id || null;
    body.master_product_id = body.master_product_id || null;




    // body.covering_unit_id = req.body.covering_unit_id != null
    //   ? BigInt(req.body.covering_unit_id)
    //   : null;




    // Set status based on user role
    if (req.user.role === 'superadmin') {
      body.active_status = constants.activeStatus.active;
    } else {
      body.active_status = constants.activeStatus.active;
    }

    const product = await new Product(body).save();

    // Handle uploaded files
    let product_image = null;

    if (req.files?.product_image?.[0]) {
      const file = req.files.product_image[0];
      const objectKey = generateObjectKey("product_image", file.originalname);
      await uploadToS3Bucket(objectKey, file.buffer);
      product_image = await getObjectUrl(objectKey);

      await new Attachments({
        entity_id: product.id,
        entity_type: 'product_image',
        photo_path: product_image,
        added_by: req.user.id
      }).save();
    }

    // Fetch updated sub-category details with uploaded attachments
    const updatedproduct = await product.where({ id: product.id }).fetch({
      require: false,
      withRelated: ['product_image'],
    });

    // Process attachment URLs
    const productData = updatedproduct.toJSON();
    productData.product_image = processAttachment(productData.product_image);

    // Send the successful response
    return res.success({ productData });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
