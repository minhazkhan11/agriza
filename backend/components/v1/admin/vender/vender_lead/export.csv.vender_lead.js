'use strict';

const fs = require('fs');
const path = require('path');
const { stringify } = require('csv-stringify/sync');
const VenderLead = require('../../../../../models/vender_lead');

module.exports = async (req, res, next) => {
  try {
    // Fetch all customers from the database
    const vender = await VenderLead.fetchAll();
    const venderData = vender.toJSON();

    if (!venderData.length) {
      return res.status(404).json({ message: 'No customer data found' });
    }

    // Convert customer data to CSV format
    const csvData = stringify(venderData, {
      header: true,
      columns: {
        id: 'ID',
        name: 'Name',
        email: 'Email',
        phone: 'Phone',
        remark: 'Remark',
        added_by: 'Added By',
        created_at: 'Created At'
      }
    });

    // Define export directory
    const exportDir = path.join(__dirname, '../../../../../public/uploads/exports');

    // Ensure directory exists
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    // Define the file path
    const filePath = path.join(exportDir, 'vender_export.csv');

    // Write CSV data to file
    fs.writeFileSync(filePath, csvData);

    // Prepare file response
    res.setHeader('Content-Disposition', 'attachment; filename=vender_export.csv');
    res.setHeader('Content-Type', 'text/csv');
    res.sendFile(filePath, (err) => {
      if (err) {
        next(err);
      } else {
        fs.unlinkSync(filePath); // Delete file after sending
      }
    });

    const fileUrl = process.env.BASE_URL + filePath.split('public')[1];

    return res.json({
      message: 'vender exported successfully',
      file_url: fileUrl
    });

  } catch (error) {
    console.error('Error exporting vender:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};
