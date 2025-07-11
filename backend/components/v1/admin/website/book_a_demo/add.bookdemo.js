'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Bookdemo = require('../../../../../models/book_a_demo');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.book_a_demo;

    const check = await Bookdemo
      .query((qb) => {
        qb.where(function () {
          this.where('phone', body.phone)
        })
          .whereIn('active_status', ['active', 'inactive']);
      })
      .fetch({ require: false });

    if (check) {
      return res.serverError(500, ErrorHandler("All Ready Book A Demo"));
    }

    body.added_by = req.user && req.user.id ? req.user.id : null;

    const book_a_demo = await new Bookdemo(body).save();

    return res.success({
       book_a_demo });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};