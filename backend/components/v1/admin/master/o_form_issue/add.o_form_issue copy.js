'use strict';

const { ErrorHandler, sendEmail } = require('../../../../../lib/utils');
const Issue = require('../../../../../models/o_form_issue');
const Emaildata = require('../../../../../models/o_form_email');
const path = require('path');

module.exports = async (req, res) => {
  try {
    let body = req.body.o_form_issue;


    const { license_file_path, o_form_file_path } = req.body.o_form_issue;


    ['customer_id', 'lead_id', 'o_form_id'].forEach(field => {
      if (body[field] === '') body[field] = null;
    });

    body.added_by = req.user.id;


    delete body.license_file_path;
    delete body.o_form_file_path;


    const o_form_issue_created = await new Issue(body).save();


    const o_form_issue = await Issue.where({ id: o_form_issue_created.id }).fetch({
      require: false,
      withRelated: [
        {
          'o_form_id': qb => qb.select('id', 'o_form_versioning_name'),
        },
        {
          'customer_id': qb => qb.select('id', 'first_name', 'phone', 'email'),
        },
        {
          'lead_id': qb => qb.select(
            'id',
            'name_of_dealing_person',
            'gst_number',
            'pan_number',
            'seed_license_number'
          ),
        },
      ]
    });

    // Get customer email
    const customer = o_form_issue?.related('customer_id');
    const customerEmail = customer?.get('email');

    // Send email
    if (customerEmail && license_file_path && o_form_file_path) {
      await sendEmail({
        to: customerEmail,
        subject: 'Your License and O-Form Documents',
        text: 'Dear customer,\n\nPlease find attached your license and O-form documents.\n\nThank you.',
        html: `<p>Dear customer,</p><p>Please find attached your license and O-form documents.</p><p>Thank you.</p>`,
        attachments: [
          { filename: path.basename(license_file_path), path: license_file_path },
          { filename: path.basename(o_form_file_path), path: o_form_file_path }
        ]
      });
    }

    await new Emaildata({
      license_file_path,
      o_form_file_path,
      receiver_id: body.customer_id,
      o_form_issue_id: o_form_issue_created.id,
      added_by: req.user.id,
      created_at: new Date(),
      updated_at: new Date()
    }).save();


    return res.success({ o_form_issue });

  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
