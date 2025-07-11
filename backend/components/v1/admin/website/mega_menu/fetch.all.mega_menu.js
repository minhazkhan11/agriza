const ProductCategory = require('../../../../../models/product_category')
const ProductSubCategory = require('../../../../../models/product_sub_category');
const ProductChildCategory = require('../../../../../models/Product_child_category');
const { constants } = require('../../../../../config');
const { ErrorHandler } = require('../../../../../lib/utils');


module.exports = async (req, res, next) => {
  try {

    const categories = await ProductCategory.where({ active_status: 'active' })
      .orderBy('id', 'asc')
      .fetchAll({ require: false, columns: ['id', 'category_name'] });

    let categoryArray = [];


    for (const category of categories.toJSON()) {
      let categoryJson = category;


      const subCategories = await ProductSubCategory.where({
        Product_category_id: categoryJson.id,
        active_status: 'active'
      })
        .orderBy('id', 'asc')
        .fetchAll({ require: false, columns: ['id', 'product_sub_category_name'] });

      let subCategoryArray = [];

      for (const subCategory of subCategories.toJSON()) {
        let subCategoryJson = subCategory;


        const childCategories = await ProductChildCategory.where({
          Product_sub_category_id: subCategoryJson.id,
          active_status: 'active'
        })
          .orderBy('id', 'asc')
          .fetchAll({ require: false, columns: ['id', 'product_child_category_name'] });

        let childCategoryArray = [];

        for (const childCategory of childCategories.toJSON()) {
          let childCategoryJson = childCategory;
          childCategoryArray.push(childCategoryJson);
        }

        subCategoryJson.child_categories = childCategoryArray;
        subCategoryArray.push(subCategoryJson);
      }

      categoryJson.sub_categories = subCategoryArray;
      categoryArray.push(categoryJson);
    }

    const count = categories.length;

    return res.success({

      mega_menu: categoryArray,
      count
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
