'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Issue = require('../../../../../models/o_form_issue');
const Email = require('../../../../../models/o_form_email');
const Person = require('../../../../../models/users');
const Gst = require('../../../../../models/be_gst_details');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const { id } = req.params;

    const o_form_issue = await Issue.where({ id })
      .query((qb) => {
        qb.whereIn('active_status', [
          constants.activeStatus.active,
          constants.activeStatus.inactive
        ]);
      })
      .fetch({
        require: false,
        withRelated: [
          {
            'o_form_id': function (query) {
              query.select('id', 'o_form_versioning_name');
            }
          },
          {
            'lead_id': function (query) {
              query.select(
                'id',
                'name_of_dealing_person',
                'business_name',
                'gst_number',
                'pan_number',
                'seed_license_number'
              );
            }
          }
        ]
      });

    if (!o_form_issue) {
      return res.status(404).json({
        success: false,
        message: 'Issue not found'
      });
    }

    const issue = o_form_issue.toJSON();

    // Fetch receiver details from o_form_email → users
    const emailData = await Email.where('o_form_issue_id', issue.id).fetch({ require: false });

    if (emailData) {
      const receiver = await Person.where('id', emailData.get('receiver_id')).fetch({
        require: false,
        columns: ['first_name', 'email']
      });
      issue.receiver = receiver ? receiver.toJSON() : null;
    } else {
      issue.receiver = null;
    }

    // Fetch GST details using customer_id
    if (issue.customer_id) {
      const gstData = await Gst.where('id', issue.customer_id).fetch({
        require: false,
        columns: ['gst_number', 'legal_name']
      });
      issue.gst_details = gstData ? gstData.toJSON() : null;
    } else {
      issue.gst_details = null;
    }

    return res.status(200).json({
      success: true,
      o_form_issue: issue
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: ErrorHandler(error)
    });
  }
};
