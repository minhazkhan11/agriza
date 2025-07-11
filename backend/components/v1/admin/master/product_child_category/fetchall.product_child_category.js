// 'use strict';

// const ProductChildCategory = require('../../../../../models/Product_child_category');
// const Attachments = require('../../../../../models/attachments');
// const { constants } = require('../../../../../config');
// const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');

// module.exports = async (req, res, next) => {
//   try {
//     const child_categories = await ProductChildCategory.query((qb) => {
//       qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
//         .orderBy('created_at', 'asc');
//     }).fetchAll({
//       require: false,
//       withRelated: [
//         {
//           'Product_sub_category_id': function (query) {
//             query.select('id', 'product_sub_category_name');
//           }
//         }
//       ]
//     });

//     let processedChildCategories = [];

//     for (const childCategory of child_categories) {
//       let childCategoryData = childCategory.toJSON();

//       // Fetch only the first active image related to this sub-category
//       let attachment = await Attachments.where({
//         entity_id: childCategory.id,
//         entity_type: 'child_category_image',
//         active_status: constants.activeStatus.active // Fetch only active images
//       }).orderBy('created_at', 'asc').fetch({ require: false });

//       childCategoryData.child_category_image = attachment ? processAttachment(attachment.toJSON()) : null;

//       processedChildCategories.push(childCategoryData);
//     }

//     const count = processedChildCategories.length;

//     return res.success({
//       product_child_category: processedChildCategories,
//       count
//     });
//   } catch (error) {
//     return res.serverError(500, ErrorHandler(error));
//   }
// };
'use strict';

const ProductChildCategory = require('../../../../../models/Product_child_category');
const ProductCategory = require('../../../../../models/product_category');
const Attachments = require('../../../../../models/attachments');
const { constants } = require('../../../../../config');
const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');

module.exports = async (req, res, next) => {
  try {
    const child_categories = await ProductChildCategory.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .orderBy('created_at', 'asc');
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

      // Fetch related Product Category details using Product_category_id
      if (childCategoryData.Product_sub_category_id) {
        const productCategory = await ProductCategory.where('id', childCategoryData.Product_sub_category_id.Product_category_id)
          .fetch({ require: false });

        childCategoryData.Product_category_id = productCategory
          ? {
            id: productCategory.get('id'),
            category_name: productCategory.get('category_name')
          }
          : null;
      }

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
