
'use strict';
const fs = require('fs');
const { ErrorHandler, processAttachment } = require('../../../../../../lib/utils');
const User = require('../../../../../../models/users');
const { uploadToS3Bucket, getObjectUrl } = require('../../../../../../lib/utils/aws/s3');
const generateObjectKeyMultiple = require('../../../../../../lib/utils/aws/s3/generateObjectKeyMultiple');
const Attachment = require('../../../../../../models/attachments');
const Assigned = require('../../../../../../models/assigned');
// const Assigneds = require('../../../../../../models/assigned_to');
const { constants } = require('../../../../../../config');

module.exports = async (req, res) => {
  try {
    let userBody = req.body.user;
    userBody = JSON.parse(userBody);

    console.log(userBody);

    // Validate phone and email
    const userCheck = await User
      .query((qb) => {
        qb.where(function () {
          this.where('phone', userBody.phone);
        })
          .whereIn('active_status', ['active', 'inactive']);
      })
      .fetch({ require: false });

    if (userCheck)
      return res.serverError(400, ErrorHandler('Phone has already been taken'));

    if (!userBody.password || userBody.password === '') {
      userBody.password = '123456';
    }

    // Keep only required fields for User table
    const userData = {
      first_name: userBody.first_name,
      email: userBody.email,
      phone: userBody.phone,
      password: userBody.password,
      pan: userBody.pan,
      aadhaar: userBody.aadhaar,
      alternative_phone: userBody.alternative_phone,
      menu_plan_id: userBody.menu_plan_id,
      r_address: userBody.r_address,
      father_name: userBody.father_name,
      pincode_id: userBody.pincode_id,
      place_id: userBody.place_id,
      role: 'user',
      added_by: req.user.id,
      created_at: new Date(),
      updated_at: new Date()
    };

    const user = await new User(userData).save();

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

    // Save assigned data
    const assignedData = {
      business_area_zone: userBody.business_area_zone || null,
      business_area_id: userBody.business_area_id ? JSON.stringify(userBody.business_area_id) : null,
      warehouse_id: userBody.warehouse_id ? JSON.stringify(userBody.warehouse_id) : null,
      gst_id: userBody.gst_id ? JSON.stringify(userBody.gst_id) : null,
      vendor_id: userBody.vendor_id ? JSON.stringify(userBody.vendor_id) : null,
      customer_id: userBody.customer_id ? JSON.stringify(userBody.customer_id) : null,
      Effective_date_change: userBody.Effective_date_change || null,
      be_information_id: userBody.be_information_id,
      user_id: user.id,
      added_by: req.user.id,
      created_at: new Date(),
      updated_at: new Date()
    };
    console.log("Assigned Data:", assignedData);

    await new Assigned(assignedData).save();

    // // Save assigned_to data
    // const assigntoData = {
    //   be_information_id: userBody.be_information_id !== undefined && !isNaN(userBody.be_information_id) ? parseInt(userBody.be_information_id, 10) : null,
    //   user_id: user.id,
    //   added_by: req.user.id
    // };
    // await new Assigneds(assigntoData).save();

    // Fetch be_information_id from Assigneds where user_id matches req.user.id


    // const assignedUser = await Assigneds.where({ user_id: req.user.id }).fetch({ require: false });

    // const assigntoData = {
    //   be_information_id: assignedUser ? assignedUser.get('be_information_id') : null,
    //   user_id: user.id,
    //   added_by: req.user.id
    // };

    // await new Assigneds(assigntoData).save();


    // Fetch updated user details with uploaded attachments
    const updatedUser = await User.where({ id: user.id }).fetch({
      require: false,
      withRelated: ['staff_photo', 'pan_upload', 'aadhar_upload']
    });

    console.log("Fetched User Image Data:", updatedUser.related('staff_photo').toJSON());

    // Process attachment URLs
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
