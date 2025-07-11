'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Contact = require('../../../../../models/contact_us');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const contact_us = await Contact.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .orderBy('created_at', 'asc');
    }).fetchAll({ require: false });

    const count = contact_us.length;

    return res.success({
      contact_us, count
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};