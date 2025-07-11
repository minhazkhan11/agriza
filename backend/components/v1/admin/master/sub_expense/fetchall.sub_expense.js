'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const SubExpense = require('../../../../../models/sub_expense');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const subExpense = await SubExpense.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive, constants.activeStatus.rejected, constants.activeStatus.submitted, constants.activeStatus.approved])
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      withRelated: [{
        expense_photo: (qb) => {
          qb.where({ active_status: 'active' })
        },
      }, 'expense_id'],
    });

    const formattedData = subExpense.toJSON().map((item) => {
      return {
        ...item,
        expense_photo: item.expense_photo?.photo_path || null,
      };
    });

    return res.success({
      sub_expense: formattedData,
      count: formattedData.length,
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
