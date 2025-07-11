'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Contact = require('../../../../../models/contact_us');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let body = req.body.contact_us;

    const check = await Contact
      .query((qb) => {
        qb.where(function () {
          this.where('phone', body.phone)
        })
          .whereIn('active_status', ['active', 'inactive']);
      })
      .fetch({ require: false });

    if (check) {
      return res.serverError(500, ErrorHandler("All Aeady Contact Us"));
    }

    body.added_by = req.user && req.user.id ? req.user.id : null;

    const contact_us = await new Contact(body).save();

    return res.success({ contact_us });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};