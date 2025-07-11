'use strict';

const fs = require('fs');
const { ErrorHandler, uploadImage, processAttachment } = require('../../../../../lib/utils');
const Product = require('../../../../../models/product');
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
      body.active_status = constants.activeStatus.pending;
    }

    const product = await new Product(body).save();

    // Handle uploaded files
    const uploadedImagePaths = [];
    if (req.files && Array.isArray(req.files)) {
      for (const imageFile of req.files) {
        const entityId = product.id;
        const entityType = 'Products';
        const folderName = 'product';
        const imagePrefix = 'product';

        const uploadedImagePath = await uploadImage(
          imageFile,
          folderName,
          imagePrefix,
          entityId,
          entityType,
          req.user.id
        );
        uploadedImagePaths.push(uploadedImagePath);
      }
    }

    // Fetch the updated product data
    const newProduct = await Product.where({
      id: product.id,
      // active_status: constants.activeStatus.active
    }).fetch({ require: false });

    if (!newProduct) {
      return res.notFound({ error: 'Product not found or inactive' });
    }

    const productData = newProduct.toJSON();

    // Fetch and process attachments
    const attachments = await Attachments.where({
      entity_id: product.id,
      entity_type: 'Products',
      active_status: constants.activeStatus.active
    }).fetchAll({ require: false });

    const attachmentArray = [];
    if (attachments) {
      for (const attachment of attachments.toJSON()) {
        const imageUrl = processAttachment(attachment);
        attachmentArray.push(imageUrl);
      }
    }

    // Add processed attachments to product data
    productData.images = attachmentArray;

    // Send the successful response
    return res.success({ productData });
  } catch (error) {
    // Clean up uploaded files in case of error
    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files) {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
    }

    // Handle the error and send the response
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};


