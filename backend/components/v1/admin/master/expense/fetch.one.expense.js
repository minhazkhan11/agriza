'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Expense = require('../../../../../models/expenses');
const { constants } = require('../../../../../config');


module.exports = async (req, res, next) => {
  try {
    const expense = await Expense.query((qb) => {
      qb
        .andWhere({ id: req.params.id })
        .orderBy('created_at', 'asc');
    }).fetch({
      require: false,
    });

    if (!expense)
      return res.serverError(400, 'invalid Expense ');
    return res.success({ expense });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
