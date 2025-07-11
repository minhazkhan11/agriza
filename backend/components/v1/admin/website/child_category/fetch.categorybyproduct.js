'use strict';
const ProductCategory = require('../../../../../models/product_category');
const ProductSubCategory = require('../../../../../models/product_sub_category');
const ProductChildCategory = require('../../../../../models/Product_child_category');
const Attachments = require('../../../../../models/attachments');
const { constants } = require('../../../../../config');
const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');

module.exports = async (req, res, next) => {
  try {
    // ✅ Fetch category
    const category = await ProductCategory.where({
      id: 4,
      active_status: 'active'
    }).fetch({ require: false, columns: ['id', 'category_name'] });

    if (!category) {
      return res.success({ farm_equipments: [] });
    }

    let categoryJson = category.toJSON();
    let allChildCategories = [];

    // ✅ Fetch all subcategories
    const subCategories = await ProductSubCategory.where({
      Product_category_id: categoryJson.id,
      active_status: 'active'
    }).fetchAll({ require: false, columns: ['id'] });

    if (!subCategories.isEmpty()) {
      let subCategoriesJson = subCategories.toJSON();

      // ✅ Fetch child categories for each subcategory
      for (let subCategory of subCategoriesJson) {
        const childCategories = await ProductChildCategory.where({
          Product_sub_category_id: subCategory.id,
          active_status: 'active'
        }).fetchAll({ require: false, columns: ['id', 'product_child_category_name'] });

        if (!childCategories.isEmpty()) {
          for (const childCategory of childCategories.toJSON()) {
            let childCategoryData = { ...childCategory };

            // Fetch first active image related to this child category
            let attachment = await Attachments.where({
              entity_id: childCategory.id,
              entity_type: 'child_category_image',
              active_status: constants.activeStatus.active
            })
              .orderBy('created_at', 'asc')
              .fetch({ require: false });

            childCategoryData.child_category_image = attachment ? processAttachment(attachment.toJSON()) : null;
            allChildCategories.push(childCategoryData);
          }
        }
      }
    }

    categoryJson.child_categories = allChildCategories;

    return res.success({ farm_equipments : categoryJson });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
