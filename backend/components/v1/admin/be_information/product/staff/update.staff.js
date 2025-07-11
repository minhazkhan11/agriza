'use strict';
const fs = require('fs');
const bcrypt = require('bcrypt'); // Import bcrypt for password hashing
const { ErrorHandler, processAttachment } = require('../../../../../../lib/utils');
const User = require('../../../../../../models/users');
const { uploadToS3Bucket, getObjectUrl } = require('../../../../../../lib/utils/aws/s3');
const generateObjectKeyMultiple = require('../../../../../../lib/utils/aws/s3/generateObjectKeyMultiple');
const Attachment = require('../../../../../../models/attachments');
const Assigned = require('../../../../../../models/assigned');
// const Assigneds = require('../../../../../../models/assigned_to');
const { constants } = require('../../../../../../config');

const saltRounds = 10; // Define salt rounds for hashing

module.exports = async (req, res) => {
  try {
    let userBody = req.body.user;
    userBody = JSON.parse(userBody);

    console.log("User Data Received:", userBody);

    if (!userBody.id) {
      return res.serverError(400, ErrorHandler('User ID is required for update'));
    }


    let user = await User.where({ id: userBody.id }).fetch({ require: false });

    if (!user) {
      return res.serverError(404, ErrorHandler('User not found'));
    }

    let owner = user;
    let userData = {};

    const userColumns = ['first_name', 'email', 'phone', 'pan', 'aadhaar', 'alternative_phone', 'menu_plan_id', 'r_address', 'father_name', 'pincode_id', 'place_id', 'updated_at'];
    userColumns.forEach((col) => {
      if (userBody[col] !== undefined) {
        userData[col] = userBody[col];
      }
    });

    if (userBody.password) {
      const salt = await bcrypt.genSalt(saltRounds);
      userData.password = await bcrypt.hash(userBody.password, salt);
    }

    userData.updated_at = new Date();
    await owner.save(userData, { patch: true });

    const attachments = [
      { key: "staff_photo", type: "staff_photo" },
      { key: "pan_upload", type: "pan" },
      { key: "aadhar_upload", type: "aadhaar" },
    ];

    for (const attachment of attachments) {
      const files = req.files?.[attachment.key] || []; // Get all uploaded files (array)

      for (const file of files) {
        if (file) {
          // Check if an existing attachment is present
          const existingAttachment = await Attachment.where({
            entity_id: user.id,
            entity_type: attachment.type,
            active_status: constants.activeStatus.active,
          }).fetch({ require: false });

          if (existingAttachment) {
            existingAttachment.set("active_status", constants.activeStatus.inactive);
            await existingAttachment.save();
          }

          // Upload each file and get the file URL
          const objectKey = generateObjectKeyMultiple('user', attachment.type, file.originalname);
          await uploadToS3Bucket(objectKey, file.buffer);
          const fileUrl = await getObjectUrl(objectKey);

          // Save new attachment record
          await new Attachment({
            entity_id: user.id,
            entity_type: attachment.type,
            photo_path: fileUrl,
            added_by: req.user.id,
            active_status: constants.activeStatus.active,
          }).save();
        }
      }
    }


    const assignedData = {
      business_area_zone: userBody.business_area_zone !== undefined ? String(userBody.business_area_zone) : '',
      business_area_id: userBody.business_area_id !== undefined ? JSON.stringify(userBody.business_area_id) : JSON.stringify([]),
      warehouse_id: userBody.warehouse_id !== undefined ? JSON.stringify(userBody.warehouse_id) : JSON.stringify([]),
      gst_id: userBody.gst_id !== undefined ? JSON.stringify(userBody.gst_id) : JSON.stringify([]),
      vendor_id: userBody.vendor_id !== undefined ? JSON.stringify(userBody.vendor_id) : JSON.stringify([]),
      customer_id: userBody.customer_id !== undefined ? JSON.stringify(userBody.customer_id) : JSON.stringify([]),
      be_information_id: userBody.be_information_id !== undefined ? userBody.be_information_id : null,
      updated_at: new Date()
    };

    let assignedRecord = await Assigned.where({ user_id: user.id }).fetch({ require: false });

    if (assignedRecord) {
      await assignedRecord.set(assignedData).save(null, { method: 'update' });
    } else {
      assignedData.user_id = user.id;
      assignedData.added_by = req.user.id;
      assignedData.created_at = new Date();
      await new Assigned(assignedData).save();
    }



    // const assigntoData = {};
    // if (userBody.be_information_id !== undefined) assigntoData.be_information_id = userBody.be_information_id;
    // if (Object.keys(assigntoData).length > 0) {
    //   assigntoData.updated_at = new Date();
    //   let assignedToRecord = await Assigneds.where({ user_id: user.id }).fetch({ require: false });
    //   if (assignedToRecord) {
    //     await assignedToRecord.save(assigntoData, { patch: true });
    //   } else {
    //     assigntoData.user_id = user.id;
    //     assigntoData.added_by = req.user.id;
    //     await new Assigneds(assigntoData).save();
    //   }
    // }

    // const assignedUser = await Assigneds.where({ user_id: req.user.id }).fetch({ require: false });

    // const assigntoData = {
    //   be_information_id: assignedUser ? assignedUser.get('be_information_id') : userBody.be_information_id || null,
    //   user_id: user.id,
    //   added_by: req.user.id,
    //   updated_at: new Date()
    // };

    // let assignedToRecord = await Assigneds.where({ user_id: user.id }).fetch({ require: false });
    // if (assignedToRecord) {
    //   await assignedToRecord.save(assigntoData, { patch: true });
    // } else {
    //   await new Assigneds(assigntoData).save();
    // }


    const updatedUser = await User.where({ id: user.id }).fetch({
      require: false,
      withRelated: ['staff_photo', 'pan_upload', 'aadhar_upload']
    });
    let learnerData = updatedUser.toJSON();
    learnerData.staff_photo = processAttachment(learnerData.staff_photo);
    learnerData.pan_upload = processAttachment(learnerData.pan_upload);
    learnerData.aadhar_upload = processAttachment(learnerData.aadhar_upload);

    return res.success({ user: learnerData });
  } catch (error) {
    console.log(error);
    if (req.file) fs.unlinkSync(req.file.path);
    return res.serverError(500, ErrorHandler(error));
  }
};