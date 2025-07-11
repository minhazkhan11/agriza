
'use strict';

const ProductSubCategory = require('../../../../../models/product_sub_category');
const Attachments = require('../../../../../models/attachments');
const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const product_sub_category = await ProductSubCategory.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ id: req.params.id })
        .orderBy('created_at', 'asc');
    }).fetch({
      require: false,
      withRelated: [
        {
          'Product_category_id': function (query) {
            query.select('id', 'category_name');
          }
        }
      ]
    });

    if (!product_sub_category) {
      return res.serverError(400, 'Invalid product_sub_category');
    }

    let subCategoryData = product_sub_category.toJSON();

    // Fetch only the first active image related to this sub-category
    let attachment = await Attachments.where({
      entity_id: product_sub_category.id,
      entity_type: 'sub_category_image',
      active_status: constants.activeStatus.active
    }).orderBy('created_at', 'asc').fetch({ require: false });

    subCategoryData.sub_category_image = attachment ? processAttachment(attachment.toJSON()) : null;

    return res.success({ product_sub_category: subCategoryData });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
