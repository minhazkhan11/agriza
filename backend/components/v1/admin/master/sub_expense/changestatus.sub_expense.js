'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Expense = require('../../../../../models/sub_expense');
const { constants } = require('../../../../../config');


module.exports = async (req, res, next) => {
  try {

    const id = req.body.sub_expense.id;
    let Check = await Expense.where({ id }).fetch({ require: false });
    if (!Check)
      return res.serverError(400, ErrorHandler('Sub Expense not found'));

    const body = req.body.sub_expense;
    const sub_expense = await new Expense().where({ id }).save(body, { method: 'update' });

    return res.success({ sub_expense });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};