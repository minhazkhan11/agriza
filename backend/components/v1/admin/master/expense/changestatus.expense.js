'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Expense = require('../../../../../models/expenses');
const { constants } = require('../../../../../config');


module.exports = async (req, res, next) => {
  try {

    const id = req.body.expense.id;
    let Check = await Expense.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler('Expense not found'));

    const body = req.body.expense;
    const expense = await new Expense().where({ id }).save(body, { method: 'update' });

    return res.success({ expense });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};