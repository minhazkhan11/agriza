'use strict';

const { ErrorHandler, uploadImage, processAttachment } = require('../../../../../lib/utils');
const Attachments = require('../../../../../models/attachments');
const Entitybasic = require('../../../../../models/be_information');
const BeIdentityTable = require('../../../../../models/be_identity_table');
const User = require('../../../../../models/users');
const Beassigned = require('../../../../../models/assigned_to');
const BEModulePlansPpdation = require('../../../../../models/be_module_plans_updation');
const { constants } = require('../../../../../config');
const { uploadToS3Bucket, getObjectUrl } = require('../../../../../lib/utils/aws/s3');
const generateObjectKeyMultiple = require('../../../../../lib/utils/aws/s3/generateObjectKeyMultiple');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  try {
    let { be_information } = req.body;

    if (typeof be_information === 'string') {
      try {
        be_information = JSON.parse(be_information);
      } catch (err) {
        console.error("JSON Parsing Error:", err);
        return res.serverError(400, ErrorHandler("Invalid JSON format in be_information."));
      }
    }

    console.log("Received be_information:", be_information);
    if (!Array.isArray(req.body.persons)) {
      req.body.persons = [];
    }


    if (!be_information || typeof be_information !== 'object') {
      return res.serverError(400, ErrorHandler("Invalid be_information format."));
    }

    const { gst_number, pan_number } = be_information;

    if (!gst_number && !pan_number) {
      console.error("Missing GST/PAN number:", be_information);
      return res.serverError(400, ErrorHandler("Either gst_number or pan_number must be provided."));
    }

    be_information.gst_pincode_id = be_information.gst_pincode_id || null;
    be_information.postal_pincode_id = be_information.postal_pincode_id || null;

    const existingRecord = await Entitybasic
      .query((qb) => {
        qb.where(function () {
          if (gst_number) {
            this.orWhere('gst_number', gst_number);
          }
          if (pan_number) {
            this.orWhere('pan_number', pan_number);
          }
        }).whereIn('active_status', ['active', 'inactive']);
      })
      .fetch({ require: false });



    const personsData = be_information.persons || []; // Store separately
    delete be_information.persons; //  Remove from main object before updating
    let savedRecord;
    if (!existingRecord) {
      be_information.added_by = req.user.id;
      savedRecord = await new Entitybasic(be_information).save();
    } else {
      const previousModuleId = existingRecord.get('module_id');
      savedRecord = await existingRecord.save(be_information, { patch: true });
      const newModuleId = savedRecord.get('module_id');

      if (previousModuleId === 1) {
        await savedRecord.save({ module_id: 1 }, { patch: true });
      } else {
        const updatedModulePlan = await BEModulePlansPpdation
          .where({ curent_module_plan_id: previousModuleId, new_module_plan_id: newModuleId })
          .fetch({ require: false });

        if (updatedModulePlan) {
          const updatedModulePlanId = updatedModulePlan.get('updated_module_plan_id');

          if (updatedModulePlanId) {
            delete be_information.persons;
            await savedRecord.save({ module_id: updatedModulePlanId }, { patch: true });
          }
        }
      }
    }
    // if (savedRecord && personsData.length > 0) {

    //   for (const person of personsData) {
    //     try {

    //       const savedPerson = await new User({
    //         first_name: person.first_name,
    //         phone: person.phone,
    //         email: person.email,
    //         pan: person.pan,
    //         aadhaar: person.aadhaar,
    //         r_address: person.r_address,
    //         alternative_phone: person.alternative_phone,
    //         place_id: person.place_id || null,
    //         pincode_id: person.pincode_id || null,
    //         photo:  person.photo,
    //         aadhar_upload:  person.aadhar_upload,
    //         pan_upload:  person.photo,
    //         added_by: req.user.id
    //       }).save();

    //       await new Beassigned({
    //         be_information_id: savedRecord.id,
    //         person_id: savedPerson.id,
    //       }).save();


    //     } catch (error) {
    //       console.error(" Error saving person:", person, error);
    //     }
    //   }
    // } else {
    //   console.log(" No persons found in request.");
    // }

    // if (savedRecord && personsData.length > 0) {
    //   for (const person of personsData) {
    //     try {
    //       const existingUser = await User.fetch({ phone: person.phone });

    //       if (existingUser) {
    //         return res.status(400).json({ message: "User with this phone number already exists" });
    //       }
    //       const savedPerson = await new User({
    //         first_name: person.first_name,
    //         phone: person.phone,
    //         email: person.email,
    //         pan: person.pan,
    //         aadhaar: person.aadhaar,
    //         r_address: person.r_address,
    //         alternative_phone: person.alternative_phone,
    //         place_id: person.place_id || null,
    //         pincode_id: person.pincode_id || null,
    //         active_status: "inactive",
    //         password: person.password || null,
    //         added_by: req.user.id
    //       }).save();


    //       await new Beassigned({
    //         be_information_id: savedRecord.id,
    //         user_id: savedPerson.id,
    //         added_by: req.user.id,
    //       }).save();

    //       const attachments = [
    //         { key: 'photo', type: 'person_photo' },
    //         { key: 'aadhar_upload', type: 'person_aadhaar' },
    //         { key: 'pan_upload', type: 'person_pan' },
    //       ];

    //       for (const attachment of attachments) {
    //         if (person[attachment.key]) { // 🔹 Check if image path exists
    //           await new Attachments({
    //             entity_id: savedPerson.id, // 🔹 Person ID
    //             entity_type: attachment.type, // 🔹 Type (photo, aadhaar, pan)
    //             photo_path: person[attachment.key], // 🔹 Store the URL
    //             added_by: req.user.id
    //           }).save();
    //         }
    //       }

    //     } catch (error) {
    //       console.error("Error saving person:", person, error);
    //     }
    //   }
    // } else {
    //   console.log("No persons found in request.");
    // }


    if (savedRecord && personsData.length > 0) {
      try {
        const phoneNumbers = personsData.map((person) => person.phone);

        // Fetch all existing users with these phone numbers in a single query
        const existingUsers = await User.query((qb) => {
          qb.whereIn("phone", phoneNumbers);
        }).fetchAll();

        const existingPhones = existingUsers ? existingUsers.map((user) => user.get("phone")) : [];

        for (const person of personsData) {
          if (existingPhones.includes(person.phone)) {
            return res.status(400).json({ message: `User with phone number ${person.phone} already exists` });
          }

          const savedPerson = await new User({
            first_name: person.first_name,
            phone: person.phone,
            email: person.email,
            role: "admin",
            pan: person.pan,
            aadhaar: person.aadhaar,
            father_name: person.father_name,
            r_address: person.r_address,
            alternative_phone: person.alternative_phone,
            place_id: person.place_id || null,
            pincode_id: person.pincode_id || null,
            active_status: person.admin === "yes" ? "active" : "inactive",
            password: person.password || null,
            added_by: req.user.id,
          }).save();

          await new Beassigned({
            be_information_id: savedRecord.id,
            user_id: savedPerson.id,
            added_by: req.user.id,
          }).save();

          const attachments = [
            { key: "photo", type: "person_photo" },
            { key: "aadhar_upload", type: "person_aadhaar" },
            { key: "pan_upload", type: "person_pan" },
          ];

          for (const attachment of attachments) {
            if (person[attachment.key]) {
              await new Attachments({
                entity_id: savedPerson.id,
                entity_type: attachment.type,
                photo_path: person[attachment.key],
                added_by: req.user.id,
              }).save();
            }
          }
        }
      } catch (error) {
        return res.status(500).json({ message: "Internal server error" });
      }
    } else {
      return res.status(400).json({ message: "No persons found in request." });
    }


    let logo = null;
    if (req.files?.logo?.[0]) {
      const file = req.files.logo[0];
      const objectKey = generateObjectKeyMultiple("be_information", "logo", file.originalname);
      await uploadToS3Bucket(objectKey, file.buffer);
      logo = await getObjectUrl(objectKey);

      await new Attachments({
        entity_id: savedRecord.id,
        entity_type: 'logo',
        photo_path: logo,
        added_by: req.user.id
      }).save();
    }

    const updatedEntity = await Entitybasic.where({ id: savedRecord.id }).fetch({
      require: false,
      withRelated: [
        {
          'constitutions_id': function (query) {
            query.select('id', 'name');
          }
        },
        {
          'logo': function (query) {
            query.where('active_status', constants.activeStatus.active);
          }
        }
      ]
    });

    const entityData = updatedEntity.toJSON();

    entityData.logo = updatedEntity.related('logo') && updatedEntity.related('logo').toJSON()
      ? processAttachment(updatedEntity.related('logo').toJSON())
      : null;

    return res.success({ be_information: entityData });

  } catch (error) {
    console.error("Server Error:", error);
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
