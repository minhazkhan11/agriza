'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Bookdemo = require('../../../../../models/book_a_demo');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const book_a_demo = await Bookdemo.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .orderBy('created_at', 'asc');
    }).fetchAll({ require: false });

    const count = book_a_demo.length;

    return res.success({
      book_a_demo, count
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};