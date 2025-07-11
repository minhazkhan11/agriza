// 'use strict';

// const { ErrorHandler } = require('../../../../../lib/utils');
// const Entitybasic = require('../../../../../models/be_information');
// const Category = require('../../../../../models/business_category');
// const Subcategory = require('../../../../../models/sub_business_category');
// const Suppliers = require('../../../../../models/suppliers');
// const { constants } = require('../../../../../config');

// module.exports = async (req, res) => {
//   try {
//     const be_information = await Entitybasic.query((qb) => {
//       qb.where('added_by', req.user.id)
//         .whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
//         .orderBy('created_at', 'asc');
//     }).fetchAll({ require: false });

//     if (!be_information) {
//       return res.serverError(404, ErrorHandler("Data not found"));
//     }

//     let businessData = be_information.toJSON();

//     if (businessData.length > 0) {
//       for (let business of businessData) {
//         let supplierIds = [];
//         let categoryIds = [];
//         let subCategoryIds = [];

//         if (business.supplier_ids) {
//           supplierIds = typeof business.supplier_ids === "string"
//             ? JSON.parse(business.supplier_ids)
//             : business.supplier_ids;
//         }

//         if (business.business_category_ids) {
//           categoryIds = typeof business.business_category_ids === "string"
//             ? JSON.parse(business.business_category_ids)
//             : business.business_category_ids;
//         }

//         if (business.business_sub_categorys_ids) {
//           subCategoryIds = typeof business.business_sub_categorys_ids === "string"
//             ? JSON.parse(business.business_sub_categorys_ids)
//             : business.business_sub_categorys_ids;
//         }

//         // Fetch and map Supplier Details (only id and name)
//         business.suppliers = supplierIds.length
//           ? await Suppliers.where('id', 'IN', supplierIds)
//             .fetchAll({ require: false })
//             .then(suppliers => suppliers.map(supplier => ({
//               id: supplier.get('id'),
//               name: supplier.get('supplier_name')
//             })))
//           : [];

//         // Fetch and map Business Category Details (only id and name)
//         business.business_categories = categoryIds.length
//           ? await Category.where('id', 'IN', categoryIds)
//             .fetchAll({ require: false })
//             .then(categories => categories.map(category => ({
//               id: category.get('id'),
//               name: category.get('category_name')
//             })))
//           : [];

//         // Fetch and map Business Subcategory Details (only id and name)
//         business.business_sub_categories = subCategoryIds.length
//           ? await Subcategory.where('id', 'IN', subCategoryIds)
//             .fetchAll({ require: false })
//             .then(subcategories => subcategories.map(subcategory => ({
//               id: subcategory.get('id'),
//               name: subcategory.get('sub_category_name')
//             })))
//           : [];

//         delete business.supplier_ids;
//         delete business.business_category_ids;
//         delete business.business_sub_categorys_ids;
//       }
//     }

//     return res.success({ be_information: businessData });
//   } catch (error) {
//     console.error("Error:", error); // Log error for debugging
//     return res.serverError(500, { error: ErrorHandler(error) });
//   }
// };
// 'use strict';

const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
const Entitybasic = require('../../../../../models/be_information');
const Category = require('../../../../../models/business_category');
const Subcategory = require('../../../../../models/sub_business_category');
const Suppliers = require('../../../../../models/suppliers');
const { constants } = require('../../../../../config');
const Integrated_module_plans = require('../../../../../models/integrated_module_plans')
const getUserHierarchy = require('../../../../../middlewares/get.user.hierarchy');


module.exports = async (req, res) => {
  try {

    const userHierarchy = await getUserHierarchy(req.user.id); // Get upline users
    const userIdsArray = Array.from(userHierarchy);
    console.log('userIdsArray', userIdsArray);
    // Convert Set to Array

    const be_information = await Entitybasic.query((qb) => {
      qb.whereIn('added_by', userIdsArray)
        .whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      withRelated: [{
        'constitutions_id': function (query) {
          query.select('id', 'name');
        }
      },
      {
        'postal_pincode_id': function (query) {
          query.select('id', 'pin_code');
        }
      },
      {
        'gst_pincode_id': function (query) {
          query.select('id', 'pin_code');
        }
      },
      {
        'logo': function (query) {
          query.where('active_status', constants.activeStatus.active);
        }
      }]

    });

    if (!be_information) {
      return res.serverError(404, ErrorHandler("Data not found"));
    }

    let businessData = be_information.toJSON();

    if (businessData.length > 0) {
      for (let business of businessData) {
        let supplierIds = [];
        let categoryIds = [];
        let subCategoryIds = [];

        if (business.supplier_ids) {
          supplierIds = typeof business.supplier_ids === "string"
            ? JSON.parse(business.supplier_ids)
            : business.supplier_ids;
        }

        if (business.business_category_ids) {
          categoryIds = typeof business.business_category_ids === "string"
            ? JSON.parse(business.business_category_ids)
            : business.business_category_ids;
        }

        if (business.business_sub_categorys_ids) {
          subCategoryIds = typeof business.business_sub_categorys_ids === "string"
            ? JSON.parse(business.business_sub_categorys_ids)
            : business.business_sub_categorys_ids;
        }

        // Fetch and map Supplier Details (only id and name)
        business.suppliers = supplierIds.length
          ? await Suppliers.where('id', 'IN', supplierIds)
            .fetchAll({ require: false })
            .then(suppliers => suppliers.map(supplier => ({
              id: supplier.get('id'),
              name: supplier.get('supplier_name')
            })))
          : [];

        // Fetch and map Business Category Details (only id and name)
        business.business_categories = categoryIds.length
          ? await Category.where('id', 'IN', categoryIds)
            .fetchAll({ require: false })
            .then(categories => categories.map(category => ({
              id: category.get('id'),
              name: category.get('category_name')
            })))
          : [];

        // Fetch and map Business Subcategory Details (only id and name)
        business.business_sub_categories = subCategoryIds.length
          ? await Subcategory.where('id', 'IN', subCategoryIds)
            .fetchAll({ require: false })
            .then(subcategories => subcategories.map(subcategory => ({
              id: subcategory.get('id'),
              name: subcategory.get('sub_category_name')
            })))
          : [];


        business.logo = business.logo ? processAttachment(business.logo) : null;
        // Create a new field for gst/pan number
        business.gst_pan_number = business.gst_number ? business.gst_number : business.pan_number || null;


        if (business.module_id) {
          const integratedModulePlan = await Integrated_module_plans.where('id', business.module_id).fetch({ require: false });
          if (integratedModulePlan) {
            business.plan_name = integratedModulePlan.get('plan_name');
          } else {
            business.plan_name = null; // In case no plan is found
          }
        }


        delete business.supplier_ids;
        delete business.business_category_ids;
        delete business.business_sub_categorys_ids;
      }
    }

    return res.success({ be_information: businessData });
  } catch (error) {
    console.error("Error:", error); // Log error for debugging
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
