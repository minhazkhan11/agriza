
'use strict';
const ProductClass = require('../../../../../models/product_class')
const { ErrorHandler } = require('../../../../../lib/utils');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const productClass = await ProductClass.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .orderBy('created_at', 'asc');
    }).fetchAll({ require: false });

    const count = productClass.length;

    return res.success({
      productClass, count
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};


// 'use strict';
// const ProductClass = require('../../../../../models/product_class');
// const { ErrorHandler } = require('../../../../../lib/utils');
// const { constants } = require('../../../../../config');
// const getUserHierarchy = require('../../../../../middlewares/get.user.hierarchy');

// module.exports = async (req, res, next) => {
//   try {
//     const userHierarchy = await getUserHierarchy(req.user.id); // Get current user & parents only
//     const userIdsArray = Array.from(userHierarchy); // Convert Set to Array

//     // Fetch only the relevant product classes
//     const productClass = await ProductClass.query((qb) => {
//       qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
//         .andWhere('added_by', 'in', userIdsArray) // Filter based on hierarchy
//         .orderBy('created_at', 'asc');
//     }).fetchAll({ require: false });

//     const count = productClass.length;

//     return res.success({
//       productClass,
//       count,
//     });

//   } catch (error) {
//     return res.serverError(500, ErrorHandler(error));
//   }
// };
