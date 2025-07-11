'use strict';

const fs = require('fs');
const { ErrorHandler } = require('../../../../../../lib/utils');
const User = require('../../../../../../models/users');
const Assigned = require('../../../../../../models/assigned');
const Assigneds = require('../../../../../../models/assigned_to');

module.exports = async (req, res) => {
  try {

    if (req.user.role === 'superadmin') {
      return res.status(403).json({ success: false, message: 'Superadmin is not allowed to add data.' });
    }


    let userBody;
    try {
      userBody = typeof req.body.assigned === "string" ? JSON.parse(req.body.assigned) : req.body.assigned;
    } catch (error) {
      return res.status(400).json({ success: false, message: 'Invalid JSON format in the assigned body' });
    }

    const assignedData = {
      business_area_zone: parseInt(userBody.business_area_zone, 10),
      business_area_id: JSON.stringify(userBody.business_area_id),
      warehouse_id: JSON.stringify(userBody.warehouse_id),
      Effective_date_change: userBody.Effective_date_change,
      added_by: userBody.user_id,
      created_at: new Date(),
      updated_at: new Date()
    };

    const assignedEntry = await new Assigned(assignedData).save();

    if (!assignedEntry) {
      return res.status(500).json({ success: false, message: 'Failed to insert assigned data' });
    }

    const assigntoData = {
      be_information_id: req.user.id,
      user_id: userBody.user_id,
      added_by: req.user.id
    };

    const assignedToEntry = await new Assigneds(assigntoData).save();

    if (!assignedToEntry) {
      return res.status(500).json({ success: false, message: 'Failed to insert assigned_to data' });
    }

    return res.success({
      message: 'Data saved successfully',
      assigned_data: assignedEntry.toJSON(),
      assigned_to_data: assignedToEntry.toJSON(),

    });

  } catch (error) {
    console.error(error);
    if (req.file) fs.unlinkSync(req.file.path);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};
