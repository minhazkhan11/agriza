'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Expense = require('../../../../../models/sub_expense');
const { constants } = require('../../../../../config');


module.exports = async (req, res, next) => {
  try {
    const sub_expense = await Expense.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive, constants.activeStatus.rejected, constants.activeStatus.submitted, constants.activeStatus.approved])
        .andWhere({ expense_id: req.params.id })
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      withRelated: [{
        expense_photo: (qb) => {
          qb.where({ active_status: 'active' })
        },
      }, 'expense_id'],
    });

    const formattedData = sub_expense.toJSON().map((item) => {
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

