// 'use strict';

// const { ErrorHandler } = require('../../../../../lib/utils');
// const Menu = require('../../../../../models/menu_plan');
// const { constants } = require('../../../../../config');
// const User = require('../../../../../models/users');
// const getUserHierarchy = require('../../../../../middlewares/get.user.hierarchy');

// module.exports = async (req, res, next) => {
//   try {
//     let userIdsArray = [];

//     if (req.user.id === 1) {
//       // If user is Superadmin, fetch all active users
//       const allUsers = await User.query(qb => {
//         qb.where('active_status', constants.activeStatus.active);
//       }).fetchAll({ require: false });

//       userIdsArray = allUsers.map(user => user.id);
//     } else {
//       // Normal case: Get user hierarchy
//       const userHierarchy = await getUserHierarchy(req.user.id);
//       userIdsArray = Array.from(userHierarchy);
//     }
//     const menu_plan = await Menu.query((qb) => {
//       qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
//         .andWhere('added_by', 'in', userIdsArray)
//         .orderBy('created_at', 'asc');
//     }).fetchAll({
//       require: false,
//     });

//     if (!menu_plan)
//       return res.serverError(400, 'invalid menu_plan name');
//     return res.success({ menu_plan });

//   } catch (error) {
//     return res.serverError(500, ErrorHandler(error));
//   }
// };
'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Menu = require('../../../../../models/menu_plan');
const { constants } = require('../../../../../config');
const User = require('../../../../../models/users');

module.exports = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const menu_plan = await Menu.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive]);

      if (userId === 1) {
        qb.andWhere('added_by', userId);
      } else {
        qb.andWhere(function () {
          this.where('added_by', userId).orWhereNull('added_by');
        });
      }

      qb.orderBy('created_at', 'asc');
    }).fetchAll({ require: false });

    if (!menu_plan) {
      return res.serverError(400, 'Invalid menu_plan');
    }

    return res.success({ menu_plan });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};

