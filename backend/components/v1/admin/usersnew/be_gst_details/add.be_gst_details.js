
'use strict';

const { ErrorHandler, uploadImage, processAttachment } = require('../../../../../lib/utils');
const Attachments = require('../../../../../models/attachments');
const Gst = require('../../../../../models/be_gst_details');
const Person = require('../../../../../models/users');
const GstPerson = require('../../../../../models/be_gst_person_assigned');
const { constants } = require('../../../../../config');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  try {

    let { be_gst_details } = req.body;

    if (!Array.isArray(be_gst_details) || be_gst_details.length === 0) {
      return res.serverError(400, ErrorHandler("Invalid data format, expected an array for be_gst_details"));
    }

    const gstNumbers = be_gst_details.map(item => item.gst_number);
    const phoneNumbers = be_gst_details.flatMap(item => item.persons?.map(p => p.phone) || []);

    const [existingGstRecords, existingUsers] = await Promise.all([
      Gst.query(qb => qb.whereIn("gst_number", gstNumbers)).fetchAll({ require: false }),
      Person.query(qb => qb.whereIn("phone", phoneNumbers)).fetchAll({ require: false })
    ]);

    const existingGstMap = new Map(existingGstRecords.map(gst => [gst.get("gst_number"), gst]));
    const existingUserMap = new Map(existingUsers.map(user => [user.get("phone"), user]));

    let savedData = [];

    for (const gstData of be_gst_details) {
      let gstRecord = null;


      if (gstData.id) {
        gstRecord = await Gst.where({ id: gstData.id }).fetch({ require: false });

        if (!gstRecord) {
          return res.status(404).json({ message: `GST record with ID ${gstData.id} not found.` });
        }

        const duplicate = await Gst.query(qb => {
          qb.where("gst_number", gstData.gst_number);
          if (gstData.id) {
            qb.whereNot("id", gstData.id);
          }
        }).fetch({ require: false });

        if (duplicate) {
          return res.status(400).json({ message: `GST number ${gstData.gst_number} already exists.` });
        }

        await gstRecord.save({
          gst_number: gstData.gst_number,
          legal_name: gstData.legal_name,
          trade_name: gstData.trade_name,
          address_of_principal_place: gstData.address_of_principal_place,
          place_id: gstData.place_id || null,
          pin_id: gstData.pin_id || null,
          be_information_id: gstData.be_information_id || null,
        });
      } else {
        const existingGst = await Gst.where("gst_number", gstData.gst_number).fetch({ require: false });

        if (existingGst) {
          return res.status(400).json({ message: `GST number ${gstData.gst_number} already exists.` });
        }
        if (Array.isArray(gstData.persons)) {
          for (const person of gstData.persons) {
            if (!person.id) {
              const existingPhone = await Person.where({ phone: person.phone }).fetch({ require: false });
              // if (existingPhone) {
              //   return res.status(400).json({ message: `Phone number ${person.phone} already exists.` });
              // }
            }
          }
        }
        gstRecord = await new Gst({
          gst_number: gstData.gst_number,
          legal_name: gstData.legal_name,
          trade_name: gstData.trade_name,
          address_of_principal_place: gstData.address_of_principal_place,
          place_id: gstData.place_id || null,
          pin_id: gstData.pin_id || null,
          be_information_id: gstData.be_information_id || null,
          added_by: req.user.id,
        }).save();
      }


      let savedPersons = [];
      if (Array.isArray(gstData.persons) && gstData.persons.length > 0) {
        for (const person of gstData.persons) {
          let personRecord = null;

          if (person.id) {

            personRecord = await Person.where({ id: person.id }).fetch({ require: false });
          } else {

            personRecord = await Person.where({ phone: person.phone }).fetch({ require: false });

            // if (personRecord) {
            //   return res.status(400).json({ message: "Phone number already exists" });
            // }
          }

          if (personRecord) {

            const datapass = personRecord.attributes.password;
            const existingData = personRecord.toJSON();

            let updatedUserData = {
              first_name: person.first_name,
              phone: person.phone,
              email: person.email,
              pan: person.pan,
              aadhaar: person.aadhaar,
              r_address: person.r_address,
              alternative_phone: person.alternative_phone,
              place_id: person.place_id || null,
              pincode_id: person.pincode_id || null
            };


            if (typeof person.password === "string" && person.password.trim() !== "") {
              const hashedPassword = await bcrypt.hash(person.password, 10);
              updatedUserData.password = hashedPassword;
            } else {
              updatedUserData.password = datapass;
            }
            if (existingData.role === "admin" && existingData.active_status === "active") {

            } else if (existingData.role === "admin" && existingData.active_status === "inactive" && person.admin === "yes") {
              updatedUserData.role = "user";
              updatedUserData.active_status = "active";
              updatedUserData.menu_plan_id = 37;
            } else {

              updatedUserData.active_status = person.admin === "yes" ? "active" : "inactive";
              updatedUserData.role = "user";
            }

            await personRecord.save(updatedUserData, { patch: true });
          } else {

            personRecord = await new Person({
              first_name: person.first_name,
              phone: person.phone,
              email: person.email,
              pan: person.pan,
              active_status: person.admin === "yes" ? "active" : "inactive",
              aadhaar: person.aadhaar,
              r_address: person.r_address,
              alternative_phone: person.alternative_phone,
              place_id: person.place_id || null,
              menu_plan_id: 37,
              password: person.password || null,
              pincode_id: person.pincode_id || null,
              added_by: gstData.be_information_id
            }).save();
          }

          savedPersons.push(personRecord);


          const existingGstPerson = await GstPerson.where({
            gst_detail_id: gstRecord.id,
            user_id: personRecord.id
          }).fetch({ require: false });

          if (!existingGstPerson) {
            await new GstPerson({
              gst_detail_id: gstRecord.id,
              user_id: personRecord.id,
              is_admin: person.admin === "yes" ? "yes" : "no",
              is_owner_person: person.is_owner_person,
              added_by: req.user.id
            }).save();
          } else {
            await existingGstPerson.save({
              is_admin: person.admin === "yes" ? "yes" : "no",
              is_owner_person: person.is_owner_person // optionally update this too
            }, { patch: true });
          }

        }
      }

      if (gstData.gst_file) {

        const existingAttachments = await Attachments.where({
          entity_id: gstRecord.id,
          entity_type: 'gst_file',
        }).fetchAll({ require: false });


        if (existingAttachments && existingAttachments.length > 0) {
          await existingAttachments.invokeThen("save", { active_status: "inactive" }, { patch: true });
        }


        await new Attachments({
          entity_id: gstRecord.id,
          entity_type: 'gst_file',
          photo_path: gstData.gst_file,
          added_by: req.user.id,
        }).save();
      }



      savedData.push({
        gst_details: gstRecord,
        persons: savedPersons
      });
    }

    return res.success({
      message: "GST and Person details saved/updated successfully!",
      be_gst_details: savedData
    });

  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
