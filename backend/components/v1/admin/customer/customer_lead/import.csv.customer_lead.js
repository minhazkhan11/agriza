'use strict';

const fs = require('fs');
const { parse } = require('csv-parse/sync');
const path = require('path');
const CustomerLead = require('../../../../../models/customer_lead');

module.exports = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file uploaded' });
    }

    const exportPath = path.join(__dirname, '../../../../../public/uploads/exports');

    if (!fs.existsSync(exportPath)) {
      fs.mkdirSync(exportPath, { recursive: true });
    }

    const filePath = path.join(exportPath, 'customer_export.csv');
    const csvContent = fs.readFileSync(req.file.path, 'utf8');

    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    const processedRecords = [];
    const validationErrors = [];

    for (const record of records) {
      try {
        const customerData = {
          name: record['Name'] || record.name,
          email: record['Email'] || record.email,
          phone: record['Phone'] || record.phone,
          remark: record['Remark'] || record.remark,
          added_by: req.user.id
        };

        const savedCustomer = await new CustomerLead(customerData).save();
        processedRecords.push(savedCustomer.toJSON());
      } catch (error) {
        console.error('Error processing customer:', error.message);
        validationErrors.push(error.message);
      }
    }

    fs.unlinkSync(req.file.path);

    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const csvHeaders = Object.keys(processedRecords[0]).join(',') + '\n';
    const csvData = processedRecords.map(row => Object.values(row).join(',')).join('\n');

    fs.writeFileSync(filePath, csvHeaders + csvData, 'utf8');

    return res.json({
      message: 'Customers imported and exported successfully',
      count: processedRecords.length,
      relativeExportPath: `/uploads/exports/customer_export.csv`, // Web-accessible path
      // absoluteExportPath: filePath // Full server path
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error in customer import/export:', error);
    return res.status(500).json({ error: error.message });
  }
};
