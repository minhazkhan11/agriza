'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const User = require('../../../../../models/users');
const Assigned = require('../../../../../models/assigned_to');
const Entitybasic = require('../../../../../models/be_information');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    const staff_contacts = await User.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .whereIn('role', ['procurement', 'salesman'])
        .orderBy('created_at', 'asc');
    }).fetchAll({ require: false });

    if (!staff_contacts || staff_contacts.length === 0) {
      return res.serverError(404, ErrorHandler("Users not found"));
    }

    // Fetch assigned records for all users
    const assignedRecords = await Assigned.where('user_id', 'IN', staff_contacts.map(user => user.id)).fetchAll({ require: false });

    // Fetch be_information details
    const beInformationIds = assignedRecords.map(record => record.get('be_information_id'));
    const beInformationRecords = await Entitybasic.where('id', 'IN', beInformationIds).fetchAll({ require: false });

    // Create a map of be_information_id -> business_name
    const beInformationMap = {};
    beInformationRecords.forEach(info => {
      beInformationMap[info.get('id')] = info.get('business_name');
    });

    // Attach be_information_id and business_name to users
    const staffContactsWithInfo = staff_contacts.map(user => {
      const assigned = assignedRecords.find(record => record.get('user_id') === user.id);
      const be_information_id = assigned ? assigned.get('be_information_id') : null;
      const business_name = be_information_id ? beInformationMap[be_information_id] : null;

      return {
        ...user.toJSON(),
        be_information_id,
        business_name
      };
    });

    return res.success({ staff_contacts: staffContactsWithInfo });

  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
