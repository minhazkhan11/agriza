
// 'use strict';

// const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
// const Attachments = require('../../../../../models/attachments');
// const Entitybasic = require('../../../../../models/be_information');
// const { constants } = require('../../../../../config');
// const Category = require('../../../../../models/business_category');
// const Integrated_module_plans = require('../../../../../models/integrated_module_plans');

// module.exports = async (req, res, next) => {
//   try {
//     const { user_type } = req.params;

//     if (!user_type) {
//       return res.serverError(400, 'User type is required');
//     }

//     const be_information = await Entitybasic.query(qb => {
//       qb.where('added_by', req.user.id)
//         .where('user_type', user_type)
//         .whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
//         .orderBy('created_at', 'asc');
//     }).fetchAll({
//       require: false,
//       withRelated: [
//         { 'constitutions_id': qb => qb.select('id', 'name') },
//         { 'postal_pincode_id': qb => qb.select('id', 'pin_code') },
//         { 'gst_pincode_id': qb => qb.select('id', 'pin_code') },
//         { 'logo': qb => qb.where('active_status', constants.activeStatus.active) }
//       ]
//     });

//     if (!be_information || be_information.length === 0) {
//       return res.serverError(400, 'No be_information found for the given user type');
//     }

//     let businessData = be_information.toJSON();

//     for (let business of businessData) {
//       if (business.business_category_ids) {
//         const categoryIds = Array.isArray(business.business_category_ids)
//           ? business.business_category_ids
//           : JSON.parse(business.business_category_ids);

//         business.business_categories = categoryIds.length
//           ? await Category.where('id', 'IN', categoryIds)
//             .fetchAll({ require: false })
//             .then(categories =>
//               categories.map(category => ({
//                 id: category.get('id'),
//                 name: category.get('category_name')
//               }))
//             )
//           : [];
//       }

//       if (business.module_id) {
//         const integratedModulePlan = await Integrated_module_plans.where('id', business.module_id).fetch({ require: false });
//         business.plan_name = integratedModulePlan ? integratedModulePlan.get('plan_name') : null;
//       }

//       delete business.business_category_ids;
//       delete business.module_id;
//     }

//     return res.success({
//       be_information: businessData.map(entity => ({
//         ...entity,
//         logo: entity.logo ? processAttachment(entity.logo) : null
//       }))
//     });

//   } catch (error) {
//     return res.serverError(500, ErrorHandler(error));
//   }
// };
'use strict';

const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
const Attachments = require('../../../../../models/attachments');
const Entitybasic = require('../../../../../models/be_information');
const { constants } = require('../../../../../config');
const Category = require('../../../../../models/business_category');
const Integrated_module_plans = require('../../../../../models/integrated_module_plans');
const getUserHierarchy = require('../../../../../middlewares/get.user.hierarchy');

module.exports = async (req, res, next) => {
  try {
    const { user_type } = req.params;
    const userHierarchy = await getUserHierarchy(req.user.id); // Get upline users
    const userIdsArray = Array.from(userHierarchy);
    console.log('userIdsArray', userIdsArray);

    if (!user_type) {
      return res.serverError(400, 'User type is required');
    }

    const be_information = await Entitybasic.query(qb => {
      qb.
        where('user_type', user_type)
        .whereIn('added_by', userIdsArray)
        .whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      withRelated: [
        { 'constitutions_id': qb => qb.select('id', 'name') },
        { 'postal_pincode_id': qb => qb.select('id', 'pin_code') },
        { 'gst_pincode_id': qb => qb.select('id', 'pin_code') },
        { 'logo': qb => qb.where('active_status', constants.activeStatus.active) }
      ]
    });

    if (!be_information || be_information.length === 0) {
      return res.serverError(400, 'No be_information found for the given user type');
    }

    let businessData = be_information.toJSON();

    for (let business of businessData) {
      if (business.business_category_ids) {
        const categoryIds = Array.isArray(business.business_category_ids)
          ? business.business_category_ids
          : JSON.parse(business.business_category_ids);

        business.business_categories = categoryIds.length
          ? await Category.where('id', 'IN', categoryIds)
            .fetchAll({ require: false })
            .then(categories =>
              categories.map(category => ({
                id: category.get('id'),
                name: category.get('category_name')
              }))
            )
          : [];
      }

      if (business.module_id) {
        const integratedModulePlan = await Integrated_module_plans.where('id', business.module_id).fetch({ require: false });
        business.plan_name = integratedModulePlan ? integratedModulePlan.get('plan_name') : null;
      }

      delete business.business_category_ids;
      delete business.module_id;
    }

    return res.success({
      be_information: businessData.map(entity => ({
        ...entity,
        logo: entity.logo ? processAttachment(entity.logo) : null
      }))
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
