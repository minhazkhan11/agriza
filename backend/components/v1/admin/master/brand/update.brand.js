'use strict';

const { ErrorHandler, processAttachment, updateImage } = require('../../../../../lib/utils');
const Brand = require('../../../../../models/brand');
const Attachment = require('../../../../../models/attachments');
const { constants } = require('../../../../../config') // Import the updateImage function
const { uploadToS3Bucket, getObjectUrl } = require('../../../../../lib/utils/aws/s3');
const generateObjectKey = require('../../../../../lib/utils/aws/s3/generateObjectKey')

module.exports = async (req, res) => {
  try {
    let { brand } = req.body;
    try {
      brand = JSON.parse(brand);
    } catch (err) {
      return res.serverError(400, ErrorHandler('Invalid JSON format in brand data.'));
    }
    if (!brand.id) {
      return res.serverError(400, ErrorHandler('Missing required field: id.'));
    }
    let existingBrand = await Brand.where({ id: brand.id }).fetch({ require: false });
    if (!existingBrand) {
      return res.serverError(400, ErrorHandler('Brand not found.'));
    }
    if (Object.keys(brand).length > 1) {
      await existingBrand.save(brand, { patch: true });
    }
    let brand_image = null;

    if (req.files?.brand_image?.[0]) {
      const file = req.files.brand_image[0];
      const existingAttachment = await Attachment.where({
        entity_id: existingBrand.id,
        entity_type: 'brand_image',
        active_status: constants.activeStatus.active
      }).fetch({ require: false });

      if (existingAttachment) {
        existingAttachment.set('active_status', constants.activeStatus.inactive);
        console.log(existingAttachment, "hhfhhfhf");

        await existingAttachment.save();

      }
      const objectKey = generateObjectKey("brand_image", file.originalname);
      await uploadToS3Bucket(objectKey, file.buffer);
      brand_image = await getObjectUrl(objectKey);


      await new Attachment({
        entity_id: existingBrand.id,
        entity_type: 'brand_image',
        photo_path: brand_image,
        added_by: req.user.id
      }).save();
    }
    // Fetch the updated brand including the image
    const updatedBrand = await Brand.where({ id: brand.id }).fetch({
      require: false,
      withRelated: ['brand_image'],
    });

    let brandData = updatedBrand.toJSON();
    brandData.brand_image = processAttachment(brandData.brand_image);

    // Send the updated brand data as response
    return res.success({ brand: brandData });

  } catch (error) {
    // Handle server error
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
