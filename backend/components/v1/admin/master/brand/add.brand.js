
'use strict';

const { ErrorHandler, uploadImage, processAttachment } = require('../../../../../lib/utils');
const Brand = require('../../../../../models/brand');
const Attachment = require('../../../../../models/attachments');
const { uploadToS3Bucket, getObjectUrl } = require('../../../../../lib/utils/aws/s3');
const generateObjectKey = require('../../../../../lib/utils/aws/s3/generateObjectKey')
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let { brand } = req.body;

    // Safely Parse JSON if brand is a string
    try {
      brand = JSON.parse(brand);
    } catch (err) {
      return res.serverError(400, ErrorHandler('Invalid JSON format in brand data.'));
    }

    // Validate required fields
    if (!brand.brand_name) {
      return res.serverError(400, ErrorHandler('Missing required fields: brand_name.'));
    }

    brand.added_by = req.user.id;

    // Check if brand already exists
    const existingBrand = await Brand.query((qb) => {
      qb.where('brand_name', brand.brand_name)
        .whereIn('active_status', ['active', 'inactive']);
    }).fetch({ require: false });

    let savedBrand;
    if (existingBrand) {
      if (req.user.role === 'superadmin') {
        brand.active_status = constants.activeStatus.active;
      } else {
        brand.active_status = constants.activeStatus.pending;
      }
      // Update existing brand
      await existingBrand.save(brand, { patch: true });
      savedBrand = existingBrand;
    } else {
      if (req.user.role === 'superadmin') {
        brand.active_status = constants.activeStatus.active;
      } else {
        brand.active_status = constants.activeStatus.pending;
      }
      // Insert new brand
      savedBrand = await new Brand(brand).save();
    }

    let brand_image = null;

    if (req.files?.brand_image?.[0]) {
      const file = req.files.brand_image[0];
      const objectKey = generateObjectKey("brand_image", file.originalname);
      await uploadToS3Bucket(objectKey, file.buffer);
      brand_image = await getObjectUrl(objectKey);

      await new Attachment({
        entity_id: savedBrand.id,
        entity_type: 'brand_image',
        photo_path: brand_image,
        added_by: req.user.id
      }).save();
    }

    // Fetch updated brand details with uploaded attachments
    const updatedBrand = await Brand.where({ id: savedBrand.id }).fetch({
      require: false,
      withRelated: ['brand_image'],
    });
    console.log("Fetched Brand Image Data:", updatedBrand.related('brand_image').toJSON());

    // Process attachment URLs
    const brandData = updatedBrand.toJSON();
    brandData.brand_image = processAttachment(brandData.brand_image);

    return res.success({ brand: brandData });

  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
