

'use strict';
const ProductChildCategory = require('../../../../../models/Product_child_category');
const Attachments = require('../../../../../models/attachments');
const { ErrorHandler, uploadImage, processAttachment } = require('../../../../../lib/utils');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const product_child_category = await ProductChildCategory.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ id: req.params.id })
        .orderBy('created_at', 'asc');
    }).fetch({
      require: false, withRelated: [
        {
          'Product_sub_category_id': function (query) {
            query.select('id', 'product_sub_category_name');
          }
        }
      ]
    });

    if (!product_child_category) {
      return res.serverError(400, 'Invalid product_child_category');
    }

    let childCategoryData = product_child_category.toJSON();

    // Fetch only the first active image related to this sub-category
    let attachment = await Attachments.where({
      entity_id: product_child_category.id,
      entity_type: 'child_category_image',
      active_status: constants.activeStatus.active
    }).orderBy('created_at', 'asc').fetch({ require: false });

    childCategoryData.child_category_image = attachment ? processAttachment(attachment.toJSON()) : null;

    return res.success({ product_child_category: childCategoryData });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
