'use strict';

const fs = require('fs');
const { parse } = require('csv-parse/sync');
const path = require('path');
const District = require('../../../../../models/district');
const Tehsil = require('../../../../../models/tehsil');

module.exports = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file uploaded' });
    }

    const exportPath = path.join(__dirname, '../../../../../public/uploads/exports');
    if (!fs.existsSync(exportPath)) {
      fs.mkdirSync(exportPath, { recursive: true });
    }

    const filePath = path.join(exportPath, 'Tehsil_export.csv');
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
        // **Check if District exists**
        let existingDistrict = await District.where({
          district_name: record['District_name'] || record.district_name
        }).fetch({ require: false });

        if (!existingDistrict) {
          validationErrors.push(`District not found: ${record['District_name'] || record.district_name}`);
          continue; // Skip this record if District is not found
        }

        let districtId = existingDistrict.get('id'); // Use existing district_id

        // **Check if Tehsil already exists**
        let existingTehsil = await Tehsil.where({
          tehsil_name: record['Tehsil_name'] || record.tehsil_name,
          district_id: districtId
        }).fetch({ require: false });

        if (existingTehsil) {
          console.log(`Tehsil already exists: ${record['Tehsil_name'] || record.tehsil_name}`);
          continue; // Skip adding if Tehsil already exists
        }

        // **Insert Tehsil with existing District ID**
        const tehsilData = {
          tehsil_name: record['Tehsil_name'] || record.tehsil_name,
          district_id: districtId,
          added_by: req.user.id
        };

        const savedTehsil = await new Tehsil(tehsilData).save();
        processedRecords.push(savedTehsil.toJSON());
      } catch (error) {
        console.error('Error processing record:', error.message);
        validationErrors.push(error.message);
      }
    }

    fs.unlinkSync(req.file.path);

    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    if (processedRecords.length === 0) {
      return res.json({
        message: 'No new tehsil was added (All were duplicates)',
        count: 0
      });
    }

    const csvHeaders = Object.keys(processedRecords[0]).join(',') + '\n';
    const csvData = processedRecords.map(row => Object.values(row).join(',')).join('\n');

    fs.writeFileSync(filePath, csvHeaders + csvData, 'utf8');

    return res.json({
      message: 'Tehsil data imported successfully',
      count: processedRecords.length,
      relativeExportPath: `/uploads/exports/Tehsil_export.csv`
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error in import/export:', error);
    return res.status(500).json({ error: error.message });
  }
};
