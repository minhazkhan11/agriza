'use strict';
const Be_info = require('../models/assigned_to');
const Gst = require('../models/be_gst_details');
const Gst_parson = require('../models/be_gst_person_assigned');
const Staff = require('../models/assigned');

const Assigned = require('../models/assigned_to');
const User = require('../models/users');

const getUserDetailsFromRequest = async (id) => {
  console.log('getUserDetailsFromRequest', id)
  try {
    const userId = id;
    if (!userId) {
      return { be_information_id: null, role: null, menu_plan_id: null };
    }

    // Fetch user (only needed columns)
    const user = await User.where({ id: userId, active_status: 'active' })
      .query(qb => qb.select('id', 'role', 'menu_plan_id'))
      .fetch({ require: false });

    // Fetch assigned_to (only needed column)
    const assigned = await Assigned.where({ user_id: userId, active_status: 'active' })
      .query(qb => qb.select('be_information_id'))
      .fetch({ require: false });

    return {
      be_information_id: assigned?.get('be_information_id') || null,
      role: user?.get('role') || null,
      menu_plan_id: user?.get('menu_plan_id') || null,
    };

  } catch (err) {
    console.error("Error extracting user details:", err);
    return { be_information_id: null, role: null, menu_plan_id: null };
  }
};

module.exports = getUserDetailsFromRequest;
