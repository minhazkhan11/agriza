'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Expense = require('../../../../../models/expenses');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.expense;

    body.added_by = req.user?.id || null;

    const expense = await new Expense(body).save();

    return res.success({ expense });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
