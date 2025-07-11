'use strict';

const User = require('../../../../../models/users');
const Assigned = require('../../../../../models/assigned_to');
const Entitybasic = require('../../../../../models/be_information');
const { ErrorHandler } = require('../../../../../lib/utils');

module.exports = async (req, res) => {
  try {

    const owner_details = await User.where({ role: "admin" }).fetchAll({
      require: false,
      withRelated: [{
        'pincode_id': function (query) {
          query.select('id', 'pin_code');
        },
        'place_id': function (query) {
          query.select('id', 'place_name');
        }
      }]
    });

    if (!owner_details || owner_details.length === 0) {
      return res.serverError(404, ErrorHandler("Users not found"));
    }

    // Extract user IDs
    const userIds = owner_details.map(user => user.id);

    // Fetch all assigned records where user_id matches
    const assignedRecords = await Assigned.where('user_id', 'IN', userIds).fetchAll({ require: false });

    // Extract be_information_ids
    const beInformationIds = assignedRecords.map(record => record.get('be_information_id'));

    // Fetch business names from be_information table
    const beInformationRecords = await Entitybasic.where('id', 'IN', beInformationIds).fetchAll({ require: false });

    // Convert be_information data to a map for quick lookup
    const beInformationMap = {};
    beInformationRecords.forEach(info => {
      beInformationMap[info.id] = info.get('business_name');
    });

    // Attach be_information_id and business_name to owner details
    const ownerDetailsWithInfo = owner_details.map(user => {
      const assigned = assignedRecords.find(record => record.get('user_id') === user.id);
      const be_information_id = assigned ? assigned.get('be_information_id') : null;
      const business_name = be_information_id ? beInformationMap[be_information_id] : null;

      return {
        ...user.toJSON(),
        be_information_id,
        business_name
      };
    });

    return res.success({ owner_details: ownerDetailsWithInfo });

  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
