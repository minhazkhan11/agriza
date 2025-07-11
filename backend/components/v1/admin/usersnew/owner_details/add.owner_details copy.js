
// 'use strict';

// const { ErrorHandler, uploadImage, processAttachment } = require('../../../../../lib/utils');
// const User = require('../../../../../models/users');
// const Assigned = require('../../../../../models/assigned_to');
// const Attachment = require('../../../../../models/attachments');
// const Entitybasic = require('../../../../../models/be_information');
// const Integratedmoduleplans = require('../../../../../models/integrated_module_plans');
// const { constants } = require('../../../../../config');
// const bcrypt = require('bcryptjs');

// module.exports = async (req, res) => {
//   try {
//     let { owner_details } = req.body;

//     //  Safely Parse JSON
//     try {
//       owner_details = JSON.parse(owner_details);
//     } catch (err) {
//       return res.serverError(400, ErrorHandler('Invalid JSON format in owner_details.'));
//     }

//     //  Validate input
//     if (!Array.isArray(owner_details) || owner_details.length === 0) {
//       return res.serverError(400, ErrorHandler('Invalid input data format.'));
//     }

//     const added_by = req.user.id;
//     const phoneNumbers = owner_details.map((item) => item.phone);

//     //  Fetch existing users by phone number
//     const existingUsers = await User.query((qb) => {
//       qb.whereIn('phone', phoneNumbers).whereIn('active_status', ['active', 'inactive']);
//     }).fetchAll({ require: false });

//     const existingUsersMap = new Map();
//     if (existingUsers) {
//       existingUsers.forEach(user => existingUsersMap.set(user.get('phone'), user));
//     }

//     const insertedOwners = [];

//     for (const body of owner_details) {
//       const { be_information_id, phone, password, ...userBody } = body;
//       userBody.role = 'admin';
//       userBody.added_by = added_by;

//       let owner;
//       if (existingUsersMap.has(phone)) {
//         owner = existingUsersMap.get(phone);
//         if (password) {
//           const salt = await bcrypt.genSalt(10);
//           userBody.password = await bcrypt.hash(password, salt);
//         }
//         await owner.save(userBody, { patch: true });
//       } else {
//         userBody.password = password;
//         owner = await new User({ phone, ...userBody }).save();
//       }
//       const assigned_to = await new Assigned({
//         user_id: owner.id,
//         be_information_id: be_information_id,
//       }).save();
//       const beInformationRecord = await Entitybasic.where({ id: be_information_id }).fetch({ require: true });

//       const user_type = beInformationRecord.get('user_type');
//       const module_id = beInformationRecord.get('module_id');


//       let menu_plan_id = userBody.menu_plan_id;

//       if (user_type === 'business_entity') {
//         const integratedModulePlan = await Integratedmoduleplans.where({ id: module_id }).fetch({ require: true });
//         const be_admin_menu_plan_id = integratedModulePlan.get('be_admin_menu_plan_id');

//         if (!be_admin_menu_plan_id) {
//           return res.serverError(500, ErrorHandler("be_admin_menu_plan_id not found in integrated module plans"));
//         }

//         menu_plan_id = be_admin_menu_plan_id;
//       }

//       if (!menu_plan_id) {
//         return res.serverError(400, ErrorHandler("menu_plan_id is required but missing."));
//       }

//       owner.set('menu_plan_id', menu_plan_id);
//       await owner.save();


//       const attachments = [
//         { key: "photo", type: "user_photo" },
//         { key: "aadhar_upload", type: "aadhaar" },
//         { key: "pan_upload", type: "pan" },
//       ];

//       for (const attachment of attachments) {
//         const file = req.files?.[attachment.key]?.[0] || null;

//         if (file) {
//           // Check if an existing attachment is present
//           const existingAttachment = await Attachment.where({
//             entity_id: owner.id,
//             entity_type: attachment.type,
//           }).fetch({ require: false });

//           if (existingAttachment) {
//             // Delete old attachment record
//             await existingAttachment.destroy();
//           }

//           // Upload the new file and save it
//           await uploadImage(
//             file,
//             "users",
//             "user",
//             owner.id, // Uploading into User model
//             attachment.type,
//             req.user.id
//           );
//         }
//       }

//       //  Fetch updated user details with uploaded attachments
//       const updatedUser = await User.where({ id: owner.id }).fetch({
//         require: false,
//         withRelated: ['photo', 'aadhar_upload', 'pan_upload'],
//       });

//       const userData = updatedUser.toJSON();
//       userData.photo = processAttachment(userData.photo);
//       userData.aadhar_upload = processAttachment(userData.aadhar_upload);
//       userData.pan_upload = processAttachment(userData.pan_upload);

//       //  Push user and assigned_to details separately
//       insertedOwners.push({
//         owner: userData,
//         assigned_to: assigned_to.toJSON(),
//       });
//     }

//     return res.success({ owner_details: insertedOwners });

//   } catch (error) {
//     return res.serverError(500, { error: ErrorHandler(error) });
//   }
// };


'use strict';

const { ErrorHandler, uploadImage, processAttachment } = require('../../../../../lib/utils');
const User = require('../../../../../models/users');
const Assigned = require('../../../../../models/assigned_to');
const Attachment = require('../../../../../models/attachments');
const { uploadToS3Bucket, getObjectUrl } = require('../../../../../lib/utils/aws/s3');
const generateObjectKeyMultiple = require('../../../../../lib/utils/aws/s3/generateObjectKeyMultiple');
const Entitybasic = require('../../../../../models/be_information');
const Integratedmoduleplans = require('../../../../../models/integrated_module_plans');
const { constants } = require('../../../../../config');
const bcrypt = require('bcryptjs');

module.exports = async (req, res) => {
  try {
    let { owner_details } = req.body;

    //  Safely Parse JSON
    try {
      owner_details = JSON.parse(owner_details);
    } catch (err) {
      return res.serverError(400, ErrorHandler('Invalid JSON format in owner_details.'));
    }

    //  Validate input
    if (!Array.isArray(owner_details) || owner_details.length === 0) {
      return res.serverError(400, ErrorHandler('Invalid input data format.'));
    }

    const added_by = req.user.id;
    const phoneNumbers = owner_details.map((item) => item.phone);

    //  Fetch existing users by phone number
    const existingUsers = await User.query((qb) => {
      qb.whereIn('phone', phoneNumbers).whereIn('active_status', ['active', 'inactive']);
    }).fetchAll({ require: false });

    const existingUsersMap = new Map();
    if (existingUsers) {
      existingUsers.forEach(user => existingUsersMap.set(user.get('phone'), user));
    }

    const insertedOwners = [];

    for (const body of owner_details) {
      const { be_information_id, phone, password, ...userBody } = body;
      userBody.role = 'admin';
      userBody.added_by = added_by;

      let owner;
      if (existingUsersMap.has(phone)) {
        owner = existingUsersMap.get(phone);
        if (password) {
          const salt = await bcrypt.genSalt(10);
          userBody.password = await bcrypt.hash(password, salt);
        }
        await owner.save(userBody, { patch: true });
      } else {
        userBody.password = password;
        owner = await new User({ phone, ...userBody }).save();
      }
      const assigned_to = await new Assigned({
        user_id: owner.id,
        be_information_id: be_information_id,
      }).save();
      const beInformationRecord = await Entitybasic.where({ id: be_information_id }).fetch({ require: true });

      const user_type = beInformationRecord.get('user_type');
      const module_id = beInformationRecord.get('module_id');


      let menu_plan_id = userBody.menu_plan_id;

      if (user_type === 'business_entity') {
        const integratedModulePlan = await Integratedmoduleplans.where({ id: module_id }).fetch({ require: true });
        const be_admin_menu_plan_id = integratedModulePlan.get('be_admin_menu_plan_id');

        if (!be_admin_menu_plan_id) {
          return res.serverError(500, ErrorHandler("be_admin_menu_plan_id not found in integrated module plans"));
        }

        menu_plan_id = be_admin_menu_plan_id;
      }

      if (!menu_plan_id) {
        return res.serverError(400, ErrorHandler("menu_plan_id is required but missing."));
      }

      owner.set('menu_plan_id', menu_plan_id);
      await owner.save();

      const attachments = [
        { key: "photo", type: "user_photo" },
        { key: "aadhar_upload", type: "aadhaar" },
        { key: "pan_upload", type: "pan" },
      ];

      for (const attachment of attachments) {
        const files = req.files?.[attachment.key] || []; // Get all uploaded files (array)

        for (const file of files) {
          if (file) {
            // Check if an existing attachment is present
            const existingAttachment = await Attachment.where({
              entity_id: owner.id,
              entity_type: attachment.type,
              active_status: constants.activeStatus.active,
            }).fetch({ require: false });

            if (existingAttachment) {
              existingAttachment.set("active_status", constants.activeStatus.inactive);
              await existingAttachment.save();
            }

            // Upload each file and get the file URL
            const objectKey = generateObjectKeyMultiple('owner', attachment.type, file.originalname);
            await uploadToS3Bucket(objectKey, file.buffer);
            const fileUrl = await getObjectUrl(objectKey);

            // Save new attachment record
            await new Attachment({
              entity_id: owner.id,
              entity_type: attachment.type,
              photo_path: fileUrl,
              added_by: req.user.id,
              active_status: constants.activeStatus.active,
            }).save();
          }
        }
      }

      //  Fetch updated user details with uploaded attachments
      const updatedUser = await User.where({ id: owner.id }).fetch({
        require: false,
        withRelated: ['photo', 'aadhar_upload', 'pan_upload'],
      });

      const userData = updatedUser.toJSON();
      userData.photo = processAttachment(userData.photo);
      userData.aadhar_upload = processAttachment(userData.aadhar_upload);
      userData.pan_upload = processAttachment(userData.pan_upload);

      //  Push user and assigned_to details separately
      insertedOwners.push({
        owner: userData,
        assigned_to: assigned_to.toJSON(),
      });
    }

    return res.success({ owner_details: insertedOwners });

  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};

