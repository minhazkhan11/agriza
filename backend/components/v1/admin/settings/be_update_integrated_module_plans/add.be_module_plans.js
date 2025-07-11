
'use strict';

const fs = require('fs');
const { parse } = require('csv-parse/sync');
const path = require('path');
const BEIntegratedplans = require('../../../../../models/be_module_plans_updation');

module.exports = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file uploaded' });
    }

    const exportPath = path.join(__dirname, '../../../../../public/uploads/exports');

    if (!fs.existsSync(exportPath)) {
      fs.mkdirSync(exportPath, { recursive: true });
    }

    const filePath = path.join(exportPath, 'be_module_plans_updation_export.csv');
    const csvContent = fs.readFileSync(req.file.path, 'utf8');

    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    const processedRecords = [];
    const skippedRecords = [];
    const validationErrors = [];

    for (const record of records) {
      try {
        const planData = {
          curent_module_plan_id: parseInt(record.curent_module_plan_id),
          new_module_plan_id: parseInt(record.new_module_plan_id),
          updated_module_plan_id: parseInt(record.updated_module_plan_id),
        };

        // Check for duplicate
        const existing = await BEIntegratedplans.query((qb) => {
          qb.where('curent_module_plan_id', planData.curent_module_plan_id)
            .andWhere('new_module_plan_id', planData.new_module_plan_id)
            .andWhere('updated_module_plan_id', planData.updated_module_plan_id);
        }).fetch({ require: false });

        if (existing) {
          skippedRecords.push(planData);
          continue; // Skip insert
        }

        const savedPlan = await new BEIntegratedplans(planData).save();
        processedRecords.push(savedPlan.toJSON());
      } catch (error) {
        console.error('Error processing plan data:', error.message);
        validationErrors.push(error.message);
      }
    }

    fs.unlinkSync(req.file.path);

    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    const csvHeaders = Object.keys(processedRecords[0] || {}).join(',') + '\n';
    const csvData = processedRecords.map(row => Object.values(row).join(',')).join('\n');

    if (processedRecords.length > 0) {
      fs.writeFileSync(filePath, csvHeaders + csvData, 'utf8');
    }

    return res.json({
      message: 'be_module_plans_updation data import completed',
      inserted_count: processedRecords.length,
      skipped_count: skippedRecords.length,
      relativeExportPath: processedRecords.length > 0 ? `/uploads/exports/be_module_plans_updation_export.csv` : null
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error in be_module_plans_updation import/export:', error);
    return res.status(500).json({ error: error.message });
  }
};

