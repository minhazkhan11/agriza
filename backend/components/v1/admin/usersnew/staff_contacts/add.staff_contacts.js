'use strict';

const { ErrorHandler, uploadImage, processAttachment } = require('../../../../../lib/utils');
const User = require('../../../../../models/users');
const Assigned = require('../../../../../models/assigned_to');
const Entitybasic = require('../../../../../models/be_information');
const Integratedmoduleplans = require('../../../../../models/integrated_module_plans');
const { constants } = require('../../../../../config');
const Attachment = require('../../../../../models/attachments');
const bcrypt = require('bcryptjs'); 

module.exports = async (req, res) => {
  try {
    let { staff_contacts } = req.body;

    // Parse JSON safely
    try {
      staff_contacts = JSON.parse(staff_contacts);
    } catch (err) {
      return res.serverError(400, ErrorHandler('Invalid JSON format in staff_contacts.'));
    }

    // Validate input
    if (!Array.isArray(staff_contacts) || staff_contacts.length === 0) {
      return res.serverError(400, ErrorHandler('Invalid input data format.'));
    }

    const addedBy = req.user.id;
    const phoneNumbers = staff_contacts.map((item) => item.phone);

    // Fetch existing users by phone numbers
    const existingUsers = await User.query((qb) => {
      qb.whereIn('phone', phoneNumbers).whereIn('active_status', ['active', 'inactive']);
    }).fetchAll({ require: false });

    const existingUsersMap = new Map();
    if (existingUsers) {
      existingUsers.forEach(user => existingUsersMap.set(user.get('phone'), user));
    }

    const createdUsers = [];

    for (const body of staff_contacts) {
      const { be_information_id, phone, name, email, role, password, aadhar_number, alternative_phone } = body;
      const userBody = {
        full_name: name,
        email,
        role,
        aadhaar: aadhar_number,
        added_by: addedBy,
        alternative_phone,
        active_status: constants.activeStatus.active,
      };

      let user;
      if (existingUsersMap.has(phone)) {
        user = existingUsersMap.get(phone);

        if (password) {
          const salt = await bcrypt.genSalt(10);
          userBody.password = await bcrypt.hash(password, salt);
        }

        await user.save(userBody, { patch: true });
      } else {
        userBody.password = password; 
        user = await new User({ phone, ...userBody }).save();
      }

      // Check if entity exists
      const entityRecord = await Entitybasic.where({ id: be_information_id }).fetch({ require: false });
      if (!entityRecord) {
        return res.serverError(404, ErrorHandler(`be_information_id ${be_information_id} not found.`));
      }

      const moduleId = entityRecord.get('module_id');
      const modulePlan = await Integratedmoduleplans.where({ id: moduleId }).fetch({ require: false });
      if (!modulePlan) {
        return res.serverError(404, ErrorHandler('Module plan not found.'));
      }

      let menuPlanId = null;
      if (role === 'procurement') {
        menuPlanId = modulePlan.get('procurement_menu_plan_id');
      } else if (role === 'salesman') {
        menuPlanId = modulePlan.get('salesman_menu_plan_id');
      }

      user.set('menu_plan_id', menuPlanId);
      await user.save();

      await new Assigned({
        be_information_id: be_information_id,
        user_id: user.id,
        added_by: addedBy,
        active_status: constants.activeStatus.active,
      }).save();

      // Handle file uploads
      const attachments = [
        { key: 'photo', type: 'user_photo' },
        { key: 'aadhar_upload', type: 'aadhaar' },
        { key: 'pan_upload', type: 'pan' },
      ];

      for (const attachment of attachments) {
        const file = req.files?.[attachment.key]?.[0] || null;

        if (file) {
          // Check if an existing attachment exists for the user
          const existingAttachment = await Attachment.where({
            entity_id: user.id,
            entity_type: attachment.type, // Ensure this matches your column name in DB
          }).fetch({ require: false });

          if (existingAttachment) {
            // Delete the old attachment if it exists (implement delete logic)
            await existingAttachment.destroy();
          }

          // Upload the new image
          await uploadImage(file, 'users', 'user', user.id, attachment.type, req.user.id);
        }
      }

      // Fetch updated user details with attachments
      const newUserInfo = await User.where({ id: user.id }).fetch({
        require: false,
        withRelated: ['photo', 'aadhar_upload', 'pan_upload'],
      });

      const userData = newUserInfo.toJSON();
      userData.photo = processAttachment(userData.photo);
      userData.aadhar_upload = processAttachment(userData.aadhar_upload);
      userData.pan_upload = processAttachment(userData.pan_upload);

      createdUsers.push(userData);
    }

    return res.success({ staff_contacts: createdUsers });

  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
