'use strict';

const ProductSubCategory = require('../../../../../models/product_sub_category');
const Attachments = require('../../../../../models/attachments');
const { constants } = require('../../../../../config');
const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');

module.exports = async (req, res, next) => {
  try {
    const sub_categories = await ProductSubCategory.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      withRelated: [
        {
          'Product_category_id': function (query) {
            query.select('id', 'category_name');
          }
        }
      ]
    });

    let processedSubCategories = [];

    for (const subCategory of sub_categories) {
      let subCategoryData = subCategory.toJSON();

      // Fetch only the first active image related to this sub-category
      let attachment = await Attachments.where({
        entity_id: subCategory.id,
        entity_type: 'sub_category_image',
        active_status: constants.activeStatus.active // Fetch only active images
      }).orderBy('created_at', 'asc').fetch({ require: false });

      subCategoryData.sub_category_image = attachment ? processAttachment(attachment.toJSON()) : null;

      processedSubCategories.push(subCategoryData);
    }

    const count = processedSubCategories.length;

    return res.success({
      product_sub_category: processedSubCategories,
      count
    });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
