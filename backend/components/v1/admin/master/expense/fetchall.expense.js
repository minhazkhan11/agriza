// 'use strict';

// const { ErrorHandler } = require('../../../../../lib/utils');
// const Expense = require('../../../../../models/expenses');
// const SubExpense = require('../../../../../models/sub_expense');
// const { constants } = require('../../../../../config');


// module.exports = async (req, res, next) => {
//   try {
//     const expense = await Expense.query((qb) => {
//       qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive, constants.activeStatus.rejected, constants.activeStatus.submitted, constants.activeStatus.approved])
//         .orderBy('created_at', 'asc');
//     }).fetchAll({
//       require: false,
//     });

//     const count = expense.length;

//     return res.success({
//       expense, count
//     });

//   } catch (error) {
//     return res.serverError(500, ErrorHandler(error));
//   }
// };
'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Expense = require('../../../../../models/expenses');
const SubExpense = require('../../../../../models/sub_expense');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    // Step 1: Get all expenses
    const expenses = await Expense.query((qb) => {
      qb.whereIn('active_status', [
        constants.activeStatus.active,
        constants.activeStatus.inactive,
        constants.activeStatus.rejected,
        constants.activeStatus.submitted,
        constants.activeStatus.approved,
      ]).orderBy('created_at', 'asc');
    }).fetchAll({ require: false });

    const expensesWithTotal = await Promise.all(
      expenses.map(async (expense) => {
        // Step 2: Get all sub expenses for current expense
        const subExpenses = await SubExpense.where('expense_id', expense.id).fetchAll({ require: false });

        // Step 3: Calculate total amount
        const totalAmount = subExpenses.reduce((sum, sub) => {
          return sum + (parseFloat(sub.get('amount')) || 0);
        }, 0);

        // Step 4: Add total_amount to expense object
        const expJson = expense.toJSON();
        expJson.total_amount = totalAmount;

        return expJson;
      })
    );

    return res.success({
      expense: expensesWithTotal,
      count: expensesWithTotal.length,
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
