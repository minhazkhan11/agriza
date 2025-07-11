
// 'use strict';

// const { ErrorHandler, updateImage, processAttachment } = require('../../../../../lib/utils');
// const Product = require('../../../../../models/product');
// const { constants } = require('../../../../../config');
// const Attachments = require('../../../../../models/attachments');

// module.exports = async (req, res, next) => {
//     try {
//         let body = req.body.product;

//         // Parse `body.product` safely
//         body = typeof body === 'string' ? JSON.parse(body) : body;

//         const id = body.id;
//         if (!id) {
//             return res.badRequest({ message: 'Product ID is required' });
//         }

//         // Fetch existing product
//         const existingProduct = await Product.where({ id }).fetch({ require: false });

//         if (!existingProduct) {
//             return res.notFound({ message: 'Product not found' });
//         }

//         // Remove `id` from body to prevent overwriting
//         delete body.id;

//         // Merge existing data with new data (allowing partial updates)
//         const updatedData = { ...existingProduct.toJSON(), ...body };

//         // Update product details
//         await new Product().where({ id }).save(updatedData, { method: 'update' });

//         // Handle image uploads, if any
//         const uploadedImagePaths = [];
//         if (req.files && req.files.length > 0) {
//             for (const imageFile of req.files) {
//                 const entityId = id;
//                 const entityType = 'Products';
//                 const folderName = 'product';
//                 const imagePrefix = 'product';

//                 const uploadedImagePath = await updateImage(
//                     imageFile,
//                     folderName,
//                     imagePrefix,
//                     entityId,
//                     entityType,
//                     req.user.id
//                 );
//                 uploadedImagePaths.push(uploadedImagePath);
//             }
//         }

//         // Fetch updated product data
//         const updatedProduct = await Product.where({ id }).fetch({ require: false });

//         if (!updatedProduct) {
//             return res.serverError({ message: 'Failed to fetch updated product data' });
//         }

//         const updatedProductData = updatedProduct.toJSON();

//         // Fetch product attachments
//         const attachments = await Attachments.where({
//             entity_id: id,
//             entity_type: 'Products',
//             active_status: constants.activeStatus.active
//         }).fetchAll({ require: false });

//         updatedProductData.images = [];
//         if (attachments) {
//             for (const attachment of attachments) {
//                 const imageUrl = processAttachment(attachment.toJSON());
//                 updatedProductData.images.push(imageUrl);
//             }
//         }

//         // Return updated product data
//         return res.success({ product: updatedProductData });
//     } catch (error) {
//         console.error('Error:', error);
//         return res.serverError({ message: 'Internal server error', error });
//     }
// };
'use strict';

const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
const Product = require('../../../../../models/product');
const Attachments = require('../../../../../models/attachments');
const { uploadToS3Bucket, getObjectUrl } = require('../../../../../lib/utils/aws/s3');
const generateObjectKey = require('../../../../../lib/utils/aws/s3/generateObjectKey');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
    try {
        let { product } = req.body;

        try {
            product = JSON.parse(product);
        } catch (err) {
            return res.serverError(400, ErrorHandler('Invalid JSON format in product data.'));
        }

        if (!product.id) {
            return res.serverError(400, ErrorHandler('Missing required field: id.'));
        }

        let existingProduct = await Product.where({ id: product.id }).fetch({ require: false });

        if (!existingProduct) {
            return res.serverError(400, ErrorHandler('Product not found.'));
        }

        // **Update product data except image**
        if (Object.keys(product).length > 1) {
            await existingProduct.save(product, { patch: true });
        }

        let product_image = null;

        if (req.files?.product_image?.[0]) {
            const file = req.files.product_image[0];

            // **Step 1: Purani Image Ko Inactive Karein**
            const existingAttachment = await Attachments.where({
                entity_id: product.id,
                entity_type: 'product_image',
                active_status: constants.activeStatus.active
            }).fetch({ require: false });

            if (existingAttachment) {
                existingAttachment.set('active_status', constants.activeStatus.inactive);
                await existingAttachment.save();
            }

            // **Step 2: Upload Nayi Image to S3**
            const objectKey = generateObjectKey("product_image", file.originalname);
            await uploadToS3Bucket(objectKey, file.buffer);
            product_image = await getObjectUrl(objectKey);

            // **Step 3: Save New Image in Database**
            await new Attachments({
                entity_id: product.id,
                entity_type: 'product_image',
                photo_path: product_image,
                added_by: req.user.id,
            }).save();
        }

        // **Fetch Updated Product Data**
        const updatedProduct = await Product.where({ id: product.id }).fetch({ require: false });

        if (!updatedProduct) {
            return res.serverError(404, ErrorHandler('Failed to fetch updated product.'));
        }

        let productData = updatedProduct.toJSON();
        productData.product_image = product_image || null; // Assign image URL

        return res.success({ product: productData });

    } catch (error) {
        return res.serverError(500, { error: ErrorHandler(error) });
    }
};
