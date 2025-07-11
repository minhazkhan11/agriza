'use strict';

const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
const Brand = require('../../../../../models/brand');
const Attachments = require('../../../../../models/attachments');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const brand = await Brand.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ id: req.params.id })
        .orderBy('created_at', 'asc');
    }).fetch({
      require: false,
      withRelated: [{
        'marketers_id': function (query) {
          query.select('id', 'marketer_name', 'alias_name');
        }
      }],
    });

    if (!brand) {
      return res.serverError(400, 'Invalid brand');
    }

    let brandData = brand.toJSON();

    // Fetch only the first active brand image
    let attachment = await Attachments.where({
      entity_id: brand.id,
      entity_type: 'brand_image',
      active_status: constants.activeStatus.active
    }).orderBy('created_at', 'asc').fetch({ require: false });

    // Process image and add to response
    brandData.brand_image = attachment ? processAttachment(attachment.toJSON()) : null;

    return res.success({ brand: brandData });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
