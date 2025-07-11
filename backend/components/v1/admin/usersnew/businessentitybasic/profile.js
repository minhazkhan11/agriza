
'use strict';
const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
const Entitybasic = require('../../../../../models/be_information');
const Businessinformation = require('../../../../../models/be_area_information');
const Bankdetails = require('../../../../../models/be_bank_details');
const User = require('../../../../../models/users');
const Assigned = require('../../../../../models/assigned_to');
const { constants } = require('../../../../../config');
const Attachments = require('../../../../../models/attachments');
const Integrated_module_plans = require('../../../../../models/integrated_module_plans')
const Beperson = require('../../../../../models/users');
const Beassigned = require('../../../../../models/assigned_to');
const Gst = require('../../../../../models/be_gst_details');
const GstPerson = require('../../../../../models/be_gst_person_assigned');


module.exports = async (req, res, next) => {
  try {
    const { gst_number, pan_number } = req.body.be_information;

    // Validate input
    if (!gst_number && !pan_number) {
      return res.serverError(400, 'Please provide either GST number or PAN number.');
    }


    // Step 4: Continue with your original fetch and logic if check passes

    const be_information = await Entitybasic.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere((builder) => {
          if (gst_number) builder.orWhere({ gst_number });
          if (pan_number) builder.orWhere({ pan_number });
        });
    }).fetch({
      require: false,
      withRelated: [
        'logo',
        {
          'constitutions_id': function (query) {
            query.select('id', 'name');
          }
        },
        {
          'postal_pincode_id': function (query) {
            query.select('id', 'pin_code');
          }
        },
        {
          'gst_pincode_id': function (query) {
            query.select('id', 'pin_code');
          }
        },
        {
          'gst_place_id': function (query) {
            query.select('id', 'place_name');
          }
        },
        {
          'postal_place_id': function (query) {
            query.select('id', 'place_name');
          }
        }
      ]
    });

    const entityData = be_information?.toJSON() || {};
    entityData.logo = be_information?.related('logo')?.toJSON()
      ? processAttachment(be_information.related('logo').toJSON())
      : null;
    if (entityData.module_id) {
      const integratedModulePlan = await Integrated_module_plans.where('id', entityData.module_id).fetch({ require: false });
      if (integratedModulePlan) {
        entityData.plan_name = integratedModulePlan.get('plan_name');
      } else {
        entityData.plan_name = null; // In case no plan is found
      }
    }

    if (be_information) {
      const be_information_id = be_information.get('id');
      // Fetch Bank details and assigned users
      const [bankDetails, assignedUsers] = await Promise.all([
        Bankdetails.where({ be_information_id }).fetchAll({ require: false }),
        Assigned.where({ be_information_id }).fetchAll({ require: false })
      ]);



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

      let uploadedFiles = {};

      if (attachments && attachments.length > 0) {
        uploadedFiles = attachments.toJSON().reduce((acc, attachment) => {
          acc[`${attachment.entity_type}_id`] = attachment.id;
          acc[attachment.entity_type] = attachment.photo_path;
          return acc;
        }, {});
      }


      const assignedRecords = await Beassigned.where({ be_information_id }).fetchAll({ require: false });

      let persons = [];

      if (assignedRecords.length > 0) {
        const personIds = assignedRecords.toJSON().map(record => record.user_id).filter(id => id);

        if (personIds.length > 0) {
          let fetchedPersons = await Beperson.query(qb => {
            qb.whereIn('id', personIds).whereIn('active_status', ['active', 'inactive']);
          }).fetchAll({ require: false });
          fetchedPersons.forEach(person => {
            person.set('admin', person.get('active_status') === "active" ? "yes" : "no");
          });


          persons = await Promise.all(fetchedPersons.toJSON().map(async (person) => {
            let attachments = await Attachments.where({
              entity_id: person.id,
              active_status: constants.activeStatus.active
            }).fetchAll({ require: false });


            let attachmentData = {
              photo: null,
              aadhar_upload: null,
              pan_upload: null
            };

            if (attachments.length > 0) {
              for (const attachment of attachments.toJSON()) {
                if (attachment.entity_type === 'person_photo') {
                  attachmentData.photo = attachment.photo_path;
                } else if (attachment.entity_type === 'person_aadhaar') {
                  attachmentData.aadhar_upload = attachment.photo_path;
                } else if (attachment.entity_type === 'person_pan') {
                  attachmentData.pan_upload = attachment.photo_path;
                }
              }
            }

            return { ...person, ...attachmentData };
          }));
        }
      }

      const gstDetails = await Gst.query(qb => {
        qb.where({ be_information_id })
          .whereIn('active_status', ['active', 'inactive']);
      }).fetchAll({ require: false });


      // const gstDetails = await Gst.where({ be_information_id }).fetchAll({ require: false });

      const be_gst_details = await Promise.all(
        gstDetails.toJSON().map(async (gst) => {
          // Fetch assigned persons for this GST detail


          const assignedPersons = await GstPerson.where({ gst_detail_id: gst.id }).fetchAll({ require: false });

          const persons = await Promise.all(
            assignedPersons.toJSON().map(async (assigned) => {
              // const user = await User.where({ id: assigned.user_id }).fetch({ require: false });

              const user = await User.query((qb) => {
                qb.where('id', assigned.user_id)
                  .whereIn('active_status', ['active', 'inactive']);
              }).fetch({ require: false });



              if (user) {
                let userJson = user.toJSON();
                userJson.admin = userJson.active_status === "active" ? "yes" : "no";
                userJson.is_owner_person = assigned.is_owner_person || false;
                return userJson;
              }
              return null;
            })
          );

          return {
            ...gst,
            persons: persons.filter(Boolean)
          };
        })
      );



      return res.success({
        message: "Business Entity Already Registered",
        be_information: {
          ...entityData,
          persons: persons
        },
        be_gst_details: be_gst_details,
        be_bank_details: bankDetails,
        // be_owner_details: ownerDetails,
        be_document: uploadedFiles
      });
    } else {
      return res.success({ message: "Business Entity Added Successfully." });
    }
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
