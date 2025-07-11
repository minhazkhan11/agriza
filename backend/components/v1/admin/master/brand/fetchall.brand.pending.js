
'use strict';

const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
const Brand = require('../../../../../models/brand');
const Attachments = require('../../../../../models/attachments');
const { constants } = require('../../../../../config');



module.exports = async (req, res, next) => {
  try {

    const brands = await Brand.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.pending, constants.activeStatus.active, constants.activeStatus.inactive, constants.activeStatus.cancelled])
        .whereNot('added_by', 1)
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      withRelated: [
        {
          'marketers_id': function (query) {
            query.select('id', 'marketer_name', 'alias_name');
          }
        }
      ]
    });

    let processedBrands = [];

    for (const brand of brands) {
      let brandData = brand.toJSON();

      // Fetch only the first active brand image
      let attachment = await Attachments.where({
        entity_id: brand.id,
        entity_type: 'brand_image',
        active_status: constants.activeStatus.active // Fetch only active images
      }).orderBy('created_at', 'asc').fetch({ require: false });

      brandData.brand_image = attachment ? processAttachment(attachment.toJSON()) : null;

      processedBrands.push(brandData);
    }

    return res.success({
      brand: processedBrands,
      count: processedBrands.length
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
