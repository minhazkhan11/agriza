// 'use strict';

// const { ErrorHandler, sendEmail } = require('../../../../../lib/utils');
// const Issue = require('../../../../../models/o_form_issue');
// const Emaildata = require('../../../../../models/o_form_email');
// const GstPerson = require('../../../../../models/be_gst_person_assigned');
// const Person = require('../../../../../models/users');
// const path = require('path');

// module.exports = async (req, res) => {
//   try {
//     let body = req.body.o_form_issue;

//     const { license_file_path, o_form_file_path } = req.body.o_form_issue;


//     ['customer_id', 'lead_id', 'o_form_id'].forEach(field => {
//       if (body[field] === '') body[field] = null;
//     });

//     body.added_by = req.user.id;


//     delete body.license_file_path;
//     delete body.o_form_file_path;


//     const o_form_issue_created = await new Issue(body).save();

//     const o_form_issue = await Issue.where({ id: o_form_issue_created.id }).fetch({
//       require: false,
//       withRelated: [
//         {
//           'o_form_id': qb => qb.select('id', 'o_form_versioning_name'),
//         },
//         {
//           'lead_id': qb => qb.select(
//             'id',
//             'name_of_dealing_person',
//             'gst_number',
//             'pan_number',
//             'seed_license_number'
//           ),
//         },
//       ]
//     });

//     const customerId = o_form_issue?.get('customer_id');

//     const assignedUsers = await GstPerson.where({ gst_detail_id: customerId }).fetchAll({ require: false });


//     const userIds = assignedUsers.map(row => row.get('user_id'));


//     const adminUsers = await Person.query(qb => {
//       qb.whereIn('id', userIds)
//         .andWhere('role', 'admin')
//         .andWhere('active_status', 'active');
//     }).fetchAll({ require: false });
//     console.log('adminUsers', adminUsers);


//     const adminEmails = adminUsers.map(user => user.get('email')).filter(email => email);
//     const receiverId = adminUsers.at(0)?.get('id') || null;


//     if (adminEmails.length && license_file_path && o_form_file_path) {
//       await sendEmail({
//         to: adminEmails,
//         subject: 'Your License and O-Form Documents',
//         text: 'Dear admin,\n\nPlease find attached the license and O-form documents.\n\nThank you.',
//         html: `<p>Dear admin,</p><p>Please find attached the license and O-form documents.</p><p>Thank you.</p>`,
//         attachments: [
//           { filename: path.basename(license_file_path), path: license_file_path },
//           { filename: path.basename(o_form_file_path), path: o_form_file_path }
//         ]
//       });
//     }

//     // Save email data record
//     await new Emaildata({
//       license_file_path,
//       o_form_file_path,
//       receiver_id: receiverId,
//       o_form_issue_id: o_form_issue_created.id,
//       added_by: req.user.id,
//       created_at: new Date(),
//       updated_at: new Date()
//     }).save();

//     return res.success({ o_form_issue });

//   } catch (error) {
//     return res.serverError(500, { error: ErrorHandler(error) });
//   }
// };
'use strict';

const { ErrorHandler, sendEmail } = require('../../../../../lib/utils');
const Issue = require('../../../../../models/o_form_issue');
const Emaildata = require('../../../../../models/o_form_email');
const GstPerson = require('../../../../../models/be_gst_person_assigned');
const Person = require('../../../../../models/users');
const Lead = require('../../../../../models/lead');
const path = require('path');

module.exports = async (req, res) => {
  try {
    let body = req.body.o_form_issue;
    const { license_file_path, o_form_file_path, entity_type } = body;

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
          'lead_id': qb => qb.select(
            'id',
            'name_of_dealing_person',
            'business_name',
            'gst_number',
            'pan_number',
            'seed_license_number'
          ),
        },
      ]
    });

    let adminEmails = [];
    let receiverId = null;

    if (entity_type === 'Customer') {
      const customerId = o_form_issue?.get('customer_id');
      const assignedUsers = await GstPerson.where({ gst_detail_id: customerId }).fetchAll({ require: false });
      const userIds = assignedUsers.map(row => row.get('user_id'));

      const adminUsers = await Person.query(qb => {
        qb.whereIn('id', userIds)
          .andWhere('active_status', 'active');
      }).fetchAll({ require: false });

      adminEmails = adminUsers.map(user => user.get('email')).filter(email => email);
      receiverId = adminUsers.at(0)?.get('id') || null;

    } else if (entity_type === 'Lead') {
      const leadId = o_form_issue?.get('lead_id');

      if (leadId) {
        const lead = await Lead.where({ id: leadId }).fetch({ require: false });
        if (lead) {
          const leadEmail = lead.get('email');
          if (leadEmail) adminEmails = [leadEmail];
          receiverId = leadId;
        }
      }
    }

    if (adminEmails.length && license_file_path && o_form_file_path) {
      await sendEmail({
        to: adminEmails,
        subject: 'Your License and O-Form Documents',
        text: 'Dear admin,\n\nPlease find attached the license and O-form documents.\n\nThank you.',
        html: `<p>Dear admin,</p><p>Please find attached the license and O-form documents.</p><p>Thank you.</p>`,
        attachments: [
          { filename: path.basename(license_file_path), path: license_file_path },
          { filename: path.basename(o_form_file_path), path: o_form_file_path }
        ]
      });
    }

    // Save email data record
    await new Emaildata({
      license_file_path,
      o_form_file_path,
      receiver_id: receiverId,
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
