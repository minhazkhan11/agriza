'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const SubExpense = require('../../../../../models/sub_expense');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    const sub_expense = await SubExpense.where({
      id: req.params.id
    }).fetch({
      require: false,
      withRelated: [{
        expense_photo: (qb) => {
          qb.where({ active_status: 'active' })
        },
      }, 'expense_id']
    });

    if (!sub_expense) {
      return res.serverError(404, 'Sub Expense not found');
    }

    const json = sub_expense.toJSON();

    // Return only photo path (or null)
    json.expense_photo = json.expense_photo?.photo_path || null;

    return res.success({
      sub_expense: json
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
