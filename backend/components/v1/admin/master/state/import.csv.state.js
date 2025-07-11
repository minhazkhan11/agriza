'use strict';

const fs = require('fs');
const { parse } = require('csv-parse/sync');
const path = require('path');
const District = require('../../../../../models/district');
const State = require('../../../../../models/state');

module.exports = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file uploaded' });
    }

    const exportPath = path.join(__dirname, '../../../../../public/uploads/exports');

    if (!fs.existsSync(exportPath)) {
      fs.mkdirSync(exportPath, { recursive: true });
    }

    const filePath = path.join(exportPath, 'State_export.csv');
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
        // Check if state already exists
        let existingState = await State.where({ state_name: record['State_name'] || record.state_name }).fetch({ require: false });

        let stateId;
        if (existingState) {
          stateId = existingState.get('id'); // Use existing state_id
        } else {
          // Create a new state
          const StateData = {
            state_name: record['State_name'] || record.state_name,
            country_id: "1",
            added_by: req.user.id
          };
          const savedState = await new State(StateData).save();
          stateId = savedState.get('id'); // Get new state ID
        }

        // Insert District with the existing/new state_id
        const DistrictData = {
          district_name: record['District_name'] || record.district_name,
          country_id: "1",
          state_id: stateId, // Use state ID from above
          added_by: req.user.id
        };

        const savedDistrict = await new District(DistrictData).save();
        processedRecords.push(savedDistrict.toJSON());
      } catch (error) {
        console.error('Error processing record:', error.message);
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
      message: 'State and District data imported successfully',
      count: processedRecords.length,
      relativeExportPath: `/uploads/exports/State_export.csv`
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error in import/export:', error);
    return res.status(500).json({ error: error.message });
  }
};
