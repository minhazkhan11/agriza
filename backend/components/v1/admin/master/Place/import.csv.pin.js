'use strict';

const fs = require('fs');
const { parse } = require('csv-parse/sync');
const path = require('path');
const Tehsil = require('../../../../../models/tehsil');
const Pin = require('../../../../../models/pin');
const Place = require('../../../../../models/place');

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
        const tehsilName = record['Tehsil_name'] || record.tehsil_name;
        const pinCode = record['Pin_code'] || record.pin_code;
        const placeName = record['Place_name'] || record.place_name;

        // **Check if Tehsil exists**
        let existingTehsil = await Tehsil.where({ tehsil_name: tehsilName }).fetch({ require: false });

        if (!existingTehsil) {
          validationErrors.push(`Tehsil not found: ${tehsilName}`);
          continue; 
          
        }

        const tehsilId = existingTehsil.get('id');

        // **Insert Pin (if not exists)**
        let existingPin = await Pin.where({ pin_code: pinCode, tehsil_id: tehsilId }).fetch({ require: false });
        console.log('existingPin',existingPin)
        if (!existingPin) {
          existingPin = await new Pin({
            pin_code: pinCode,
            tehsil_id: tehsilId,
            added_by: req.user.id
          }).save();
        }

        const pinId = existingPin.get('id');

        // **Insert Place (if not exists)**
        let existingPlace = await Place.where({ place_name: placeName, pin_id: pinId }).fetch({ require: false });

        if (!existingPlace) {
          existingPlace = await new Place({
            place_name: placeName,
            pin_id: pinId,
            added_by: req.user.id,
            // active_status: 1 // Assuming active status is required
          }).save();
        }

        processedRecords.push({
          tehsil_id: tehsilId,
          tehsil_name: tehsilName,
          pin_id: pinId,
          pin_code: pinCode,
          place_id: existingPlace.get('id'),
          place_name: placeName
        });

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
        message: 'No new Pins or Places were added (All were duplicates)',
        count: 0
      });
    }

    // **Write the processed data to CSV**
    const csvHeaders = Object.keys(processedRecords[0]).join(',') + '\n';
    const csvData = processedRecords.map(row => Object.values(row).join(',')).join('\n');

    fs.writeFileSync(filePath, csvHeaders + csvData, 'utf8');

    return res.json({
      message: 'Tehsil, Pin, and Place data imported successfully',
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
