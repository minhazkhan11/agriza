'use strict';

const BeIdentityTable = require('../../../../../models/be_identity_table');
const BeInformation = require('../../../../../models/be_information');
const BeAssigned = require('../../../../../models/assigned_to');
const User = require('../../../../../models/users');
const { constants } = require('../../../../../config');
const getUserDetailsFromRequest = require('../../../../../middlewares/fetch.be_id_by.user_id');

module.exports = async (req, res) => {
  try {
    const user_id = req?.user?.id;
    const { be_information_id, role, menu_plan_id } = await getUserDetailsFromRequest(req?.user?.id);

    if (!user_id) {
      return res.status(400).json({ success: false, error: "User ID not found in request." });
    }

    // Step 1: Get customer entities added by the user
    const customerEntities = await BeIdentityTable
      .query(qb => {
        qb.where({ entity_type: 'vendor' })
          .whereIn('active_status', ['active', 'inactive']);
      })
      .fetchAll({ require: false });


    const customers = customerEntities?.toJSON?.() || [];

    const checks = await Promise.all(
      customers.map(async entity => {
        const userDetails = await getUserDetailsFromRequest(entity.added_by);
        return userDetails?.be_information_id === be_information_id;
      })
    );

    const filteredEntities = customers.filter((_, index) => checks[index]);

    console.log("filteredEntities", filteredEntities);

    if (filteredEntities.length === 0) {
      return res.json({ success: true, be_information: [] });
    }

    const beIds = [...new Set(filteredEntities.map(entity => entity.be_id))];

    if (beIds.length === 0) {
      return res.json({ success: true, be_information: [] });
    }

    // Step 2: Fetch assigned_to records
    const assignedRecords = await BeAssigned
      .query(qb => qb.whereIn('be_information_id', beIds))
      .fetchAll({ require: false });

    const assignedData = assignedRecords?.toJSON?.() || [];

    if (assignedData.length === 0) {
      return res.json({ success: true, be_information: [] });
    }

    const assignedBeIds = [...new Set(assignedData.map(a => a.be_information_id))];
    const userIds = [...new Set(assignedData.map(a => a.user_id))];

    // Step 3: Fetch BeInformation records
    const beInformationRecords = await BeInformation
      .query(qb => {
        qb.whereIn('id', assignedBeIds).whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive]);
      })
      .fetchAll({
        require: false,
        withRelated: [
          {
            'constitutions_id': qb => qb.select('id', 'name')
          },
          {
            'postal_pincode_id': qb => qb.select('id', 'pin_code')
          },
          {
            'gst_pincode_id': qb => qb.select('id', 'pin_code')
          }
        ]
      });

    const beInformation = beInformationRecords?.toJSON?.() || [];
    const beInfoMap = Object.fromEntries(beInformation.map(info => [info.id, info]));

    // Step 4: Fetch Users
    const userRecords = await User
      .query(qb => qb.whereIn('id', userIds))
      .fetchAll({ require: false });

    const users = userRecords?.toJSON?.() || [];
    const userMap = Object.fromEntries(users.map(user => [user.id, user]));

    // Step 5: Merge user into be_information
    const result = assignedData.map(assign => {
      const beInfo = beInfoMap[assign.be_information_id];
      const user = userMap[assign.user_id];

      if (beInfo && user) {
        return {
          ...beInfo,
          customer: user
        };
      }
      return null;
    }).filter(item => item !== null);

    return res.json({ success: true, be_information: result });

  } catch (error) {
    console.error("Error fetching customer data:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
};
