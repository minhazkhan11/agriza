'use strict';

const fs = require('fs');
const { parse } = require('csv-parse/sync');
const path = require('path');
const MainMenu = require('../../../../../models/integrated_modules_main_menu');

module.exports = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No CSV file uploaded' });
    }

    const exportPath = path.join(__dirname, '../../../../../public/uploads/exports');
    if (!fs.existsSync(exportPath)) {
      fs.mkdirSync(exportPath, { recursive: true });
    }

    const filePath = path.join(exportPath, 'integrated_modules_main_menu_export.csv');
    const csvContent = fs.readFileSync(req.file.path, 'utf8');

    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    const insertedRecords = [];
    const skippedRecords = [];
    const validationErrors = [];

    for (const record of records) {
      try {
        const menuData = {
          index_id: parseInt(record.index_id),
          name: record.name?.trim(),
          type: record.type?.trim() || null,
          icon: record.icon?.trim() || null,
          path: record.path?.trim() || null,
          actions: record.actions ? JSON.parse(record.actions) : [],
          menu_plan_id: record.menu_plan_id ? parseInt(record.menu_plan_id) : null,
          active_status: record.active_status?.trim() || 'active'
        };

        // Check for same name + menu_plan_id combination
        const existing = await MainMenu.query((qb) => {
          qb.where('name', menuData.name)
            .andWhere('menu_plan_id', menuData.menu_plan_id);
        }).fetch({ require: false });

        if (existing) {
          skippedRecords.push(menuData);
          continue;
        }

        const saved = await new MainMenu(menuData).save();
        insertedRecords.push(saved.toJSON());
      } catch (error) {
        console.error('Error processing menu record:', error.message);
        validationErrors.push(error.message);
      }
    }

    fs.unlinkSync(req.file.path);

    if (validationErrors.length > 0) {
      return res.status(400).json({ errors: validationErrors });
    }

    if (insertedRecords.length > 0) {
      const csvHeaders = Object.keys(insertedRecords[0]).join(',') + '\n';
      const csvData = insertedRecords.map(row => Object.values(row).join(',')).join('\n');
      fs.writeFileSync(filePath, csvHeaders + csvData, 'utf8');
    }

    return res.json({
      message: 'integrated_modules_main_menu data import complete',
      inserted_count: insertedRecords.length,
      skipped_count: skippedRecords.length,
      relativeExportPath: insertedRecords.length > 0 ? `/uploads/exports/integrated_modules_main_menu_export.csv` : null
    });

  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    console.error('Error in integrated_modules_main_menu import/export:', error);
    return res.status(500).json({ error: error.message });
  }
};
