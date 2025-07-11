'use strict';

const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
const Brand = require('../../../../../models/brand');
const Attachments = require('../../../../../models/attachments');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    // Fetch brands with only brand_name
    const brands = await Brand.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      columns: ['id', 'brand_name'], 
    });

    let processedBrands = [];

    for (const brand of brands) {
      let brandData = brand.toJSON();

      // Fetch only the first active brand image
      let attachment = await Attachments.where({
        entity_id: brand.id,
        entity_type: 'brand_image',
        active_status: constants.activeStatus.active, 
      })
        .orderBy('created_at', 'asc')
        .fetch({ require: false });

      brandData.brand_image = attachment ? processAttachment(attachment.toJSON()) : null;

      processedBrands.push(brandData);
    }

    return res.success({
      brands: processedBrands,
      count: processedBrands.length,
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
