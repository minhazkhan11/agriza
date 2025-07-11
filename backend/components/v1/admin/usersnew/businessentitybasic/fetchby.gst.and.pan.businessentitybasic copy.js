

// 'use strict';

// const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');

// const Entitybasic = require('../../../../../models/be_information');
// const Businessinformation = require('../../../../../models/be_area_information');
// const Bankdetails = require('../../../../../models/be_bank_details');
// const Licensedetails = require('../../../../../models/be_license_details');
// const User = require('../../../../../models/users'); // For be_owner_details & be_staff_contacts
// const Warehouseinformation = require('../../../../../models/be_warehouse_information');
// const Assigned = require('../../../../../models/assigned_to'); // Assigned users to businesses
// const { constants } = require('../../../../../config');
// const Attachments = require('../../../../../models/attachments');

// module.exports = async (req, res, next) => {
//   try {
//     const { gst_number, pan_number } = req.body.be_information;

//     // Validate input
//     if (!gst_number && !pan_number) {
//       return res.serverError(400, 'Please provide either GST number or PAN number.');
//     }

//     // Fetch be_information based on gst_number or pan_number
//     const be_information = await Entitybasic.query((qb) => {
//       qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
//         .andWhere((builder) => {
//           if (gst_number) builder.orWhere({ gst_number });
//           if (pan_number) builder.orWhere({ pan_number });
//         });
//     }).fetch({
//       require: false, withRelated: ['logo', {
//         'constitutions_id': function (query) {
//           query.select('id', 'name');
//         }
//       }, {
//           'postal_pincode_id': function (query) {
//             query.select('id', 'pin_code');
//           }
//         },
//         {
//           'gst_pincode_id': function (query) {
//             query.select('id', 'pin_code');
//           }
//         },

//       ]
//     });

//     const entityData = be_information?.toJSON() || {};
//     entityData.logo = be_information?.related('logo')?.toJSON()
//       ? processAttachment(be_information.related('logo').toJSON())
//       : null;


//     if (be_information) {
//       const be_information_id = be_information.get('id');

//       // Fetch related data
//       const [areaInfo, bankDetails, licenseDetails, warehouseInfo, assignedUsers] = await Promise.all([
//         Businessinformation.where({ be_information_id }).fetchAll({ require: false }),
//         Bankdetails.where({ be_information_id }).fetchAll({ require: false }),
//         Licensedetails.where({ be_information_id }).fetchAll({ require: false }),
//         Warehouseinformation.where({ be_information_id }).fetchAll({ require: false }),
//         Assigned.where({ be_information_id }).fetchAll({ require: false }) // Fetch assigned users
//       ]);

//       // Extract user IDs from assigned records
//       const userIds = assignedUsers.map(record => record.get('user_id'));

//       // Fetch owner and staff details with attachments
//       const users = await User.where('id', 'IN', userIds).fetchAll({ require: false });

//       async function fetchUserAttachments(userId) {
//         let attachments = await Attachments.where({
//           entity_id: userId,
//           active_status: constants.activeStatus.active
//         }).fetchAll({ require: false });

//         let attachmentArray = [];

//         if (attachments) {
//           for (const attachment of attachments) {
//             let attachmentJson = attachment.toJSON();
//             const image_url = processAttachment(attachmentJson);
//             attachmentArray.push(image_url);
//           }
//         }

//         return attachmentArray;
//       }

//       const ownerDetails = await Promise.all(users
//         .filter(user => user.get('role') === 'admin')
//         .map(async user => {
//           let userJson = user.toJSON();
//           userJson.images = await fetchUserAttachments(user.id);
//           return userJson;
//         })
//       );

//       const staffContacts = await Promise.all(users
//         .filter(user => ['procurement', 'salesman'].includes(user.get('role')))
//         .map(async user => {
//           let userJson = user.toJSON();
//           userJson.images = await fetchUserAttachments(user.id);
//           return userJson;
//         })
//       );
//       const allowedFields = [
//         "self_attested_pan",
//         "self_attested_adhaar",
//         "bank_statement",
//         "attested_pan_of_the_partnership",
//         "partnership_agreement",
//         "attested_pan_of_the_authorized_signatory",
//         "attested_adhaar_of_the_authorized_signatory",
//         "any_local_registration_number_document",
//         "govt_license_of_the_retaller",
//         "signatory_photo",
//         "pan_of_the_company",
//         "certificate_of_incorporation",
//         "moa_of_the_company",
//         "aoa_of_the_company",
//         "gst_returns_of_last_year",
//         "gst_certificate"
//       ];

//       const attachments = await Attachments.where({
//         entity_id: be_information_id,
//         active_status: constants.activeStatus.active
//       })
//         .where('entity_type', 'IN', allowedFields)
//         .orderBy('created_at', 'desc')
//         .fetchAll({ require: false });

//       let uploadedFiles = {}; // Initialize as an array with an empty object

//       if (attachments && attachments.length > 0) {
//         uploadedFiles = attachments.toJSON().reduce((acc, attachment) => {
//           acc[`${attachment.entity_type}_id`] = attachment.id; // Add document ID
//           acc[attachment.entity_type] = attachment.photo_path; // Add document URL
//           return acc;
//         }, {});
//       }

//       return res.success({
//         message: "Business Entity Already Registered",
//         be_information: entityData,
//         be_bank_details: bankDetails,
//         be_area_information: areaInfo,
//         be_warehouse_information: warehouseInfo,
//         be_license_details: licenseDetails,
//         be_owner_details: ownerDetails,
//         be_staff_contacts: staffContacts,
//         be_document: uploadedFiles


//       });
//     } else {
//       // If no record found, return success message without adding to the database
//       return res.success({ message: "Business Entity Added Successfully." });
//     }
//   } catch (error) {
//     return res.serverError(500, ErrorHandler(error));
//   }
// };

'use strict';

const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');

const Entitybasic = require('../../../../../models/be_information');
const Businessinformation = require('../../../../../models/be_area_information');
const Bankdetails = require('../../../../../models/be_bank_details');
const User = require('../../../../../models/users'); // For be_owner_details & be_staff_contacts
const Assigned = require('../../../../../models/assigned_to'); // Assigned users to businesses
const { constants } = require('../../../../../config');
const Attachments = require('../../../../../models/attachments');

module.exports = async (req, res, next) => {
  try {
    const { gst_number, pan_number } = req.body.be_information;

    // Validate input
    if (!gst_number && !pan_number) {
      return res.serverError(400, 'Please provide either GST number or PAN number.');
    }

    // Fetch be_information based on gst_number or pan_number
    const be_information = await Entitybasic.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere((builder) => {
          if (gst_number) builder.orWhere({ gst_number });
          if (pan_number) builder.orWhere({ pan_number });
        });
    }).fetch({
      require: false, withRelated: ['logo', {
        'constitutions_id': function (query) {
          query.select('id', 'name');
        }
      }, {
          'postal_pincode_id': function (query) {
            query.select('id', 'pin_code');
          }
        },
        {
          'gst_pincode_id': function (query) {
            query.select('id', 'pin_code');
          }
        },

      ]
    });

    const entityData = be_information?.toJSON() || {};
    entityData.logo = be_information?.related('logo')?.toJSON()
      ? processAttachment(be_information.related('logo').toJSON())
      : null;


    if (be_information) {
      const be_information_id = be_information.get('id');

      // Fetch related data
      const [bankDetails, assignedUsers] = await Promise.all([
        Bankdetails.where({ be_information_id }).fetchAll({ require: false }),
        Assigned.where({ be_information_id }).fetchAll({ require: false }) // Fetch assigned users
      ]);


      const userIds = assignedUsers.map(record => record.get('user_id'));

      const users = await User.where('id', 'IN', userIds).fetchAll({ require: false });

      async function fetchUserAttachments(userId) {
        let attachments = await Attachments.where({
          entity_id: userId,
          active_status: constants.activeStatus.active
        }).fetchAll({ require: false });

        let attachmentArray = [];
        let pan_upload = null;
        let aadhar_upload = null;
        let photo = null;

        if (attachments.length > 0) {
          for (const attachment of attachments) {
            let attachmentJson = attachment.toJSON();
            const image_url = attachmentJson.photo_path;

            if (attachmentJson.entity_type === 'pan') {
              pan_upload = image_url;
            } else if (attachmentJson.entity_type === 'aadhaar') {
              aadhar_upload = image_url;
            } else if (attachmentJson.entity_type === 'user_photo') {
              photo = image_url;
            }

            attachmentArray.push(image_url);
          }
        }

        return { images: attachmentArray, pan_upload, aadhar_upload, photo };
      }


      const ownerDetails = await Promise.all(users
        .filter(user => user.get('role') === 'admin')
        .map(async user => {
          let userJson = user.toJSON();
          let attachments = await fetchUserAttachments(user.id);

          // Remove 'images' array and keep only required fields
          userJson.pan_upload = attachments.pan_upload;
          userJson.aadhar_upload = attachments.aadhar_upload;
          userJson.photo = attachments.photo;

          return userJson;
        })
      );



      const allowedFields = [
        "self_attested_pan",
        "self_attested_adhaar",
        "bank_statement",
        "attested_pan_of_the_partnership",
        "partnership_agreement",
        "attested_pan_of_the_authorized_signatory",
        "attested_adhaar_of_the_authorized_signatory",
        "any_local_registration_number_document",
        "govt_license_of_the_retaller",
        "signatory_photo",
        "pan_of_the_company",
        "certificate_of_incorporation",
        "moa_of_the_company",
        "aoa_of_the_company",
        "gst_returns_of_last_year",
        "gst_certificate",
        "additional_documents"
      ];

      const attachments = await Attachments.where({
        entity_id: be_information_id,
        active_status: constants.activeStatus.active
      })
        .where('entity_type', 'IN', allowedFields)
        .orderBy('created_at', 'desc')
        .fetchAll({ require: false });

      let uploadedFiles = {}; // Initialize as an array with an empty object

      if (attachments && attachments.length > 0) {
        uploadedFiles = attachments.toJSON().reduce((acc, attachment) => {
          acc[`${attachment.entity_type}_id`] = attachment.id; // Add document ID
          acc[attachment.entity_type] = attachment.photo_path; // Add document URL
          return acc;
        }, {});
      }

      return res.success({
        message: "Business Entity Already Registered",
        be_information: entityData,
        be_bank_details: bankDetails,
        be_owner_details: ownerDetails,
        be_document: uploadedFiles


      });
    } else {
      // If no record found, return success message without adding to the database
      return res.success({ message: "Business Entity Added Successfully." });
    }
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
