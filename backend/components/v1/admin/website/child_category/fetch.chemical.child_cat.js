
'use strict';

const ProductChildCategory = require('../../../../../models/Product_child_category');
const ProductCategory = require('../../../../../models/product_category');
const Attachments = require('../../../../../models/attachments');
const { constants } = require('../../../../../config');
const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');

module.exports = async (req, res, next) => {
  try {
   
 const child_categories = await ProductChildCategory.where({
  Product_sub_category_id: 3,
      active_status: 'active'

    }).fetchAll({
      require: false,
      withRelated: [
        {
          'Product_sub_category_id': (query) => {
            query.select('id', 'product_sub_category_name', 'Product_category_id');
          }
        }
      ]
    });
    

    let processedChildCategories = [];

    for (const childCategory of child_categories) {
      let childCategoryData = childCategory.toJSON();

      // Fetch only the first active image related to this child category
      let attachment = await Attachments.where({
        entity_id: childCategory.id,
        entity_type: 'child_category_image',
        active_status: constants.activeStatus.active
      }).orderBy('created_at', 'asc').fetch({ require: false });

      childCategoryData.child_category_image = attachment ? processAttachment(attachment.toJSON()) : null;

      processedChildCategories.push(childCategoryData);
    }

    const count = processedChildCategories.length;

    return res.success({
      product_child_category: processedChildCategories,
      count
    });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
