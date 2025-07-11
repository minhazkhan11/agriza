'use strict';

const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');  // Synchronous CSV parser
const Product = require('../../../../../models/product');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    // Ensure a CSV file was uploaded (using multer, for example)
    if (!req.file) {
      console.log('Uploaded file:', req.file);
      return res.serverError(400, { error: 'No CSV file uploaded' });
    }

    // The file path provided by multer (e.g., req.file.path)
    const filePath = req.file.path;

    // Read the file contents
    const csvContent = fs.readFileSync(filePath, 'utf8');

    // Parse CSV data
    // Assumes that the CSV file has headers. For example, the exported CSV headers:
    // "Serial Number", "Product Name", "Alias", "HSN Code", "Marketer ", "Gst Percent", 
    // "Product Category Name", "Product Sub Category Name", "Class Name", "Brand Name", 
    // "Primary Unit", "Primary Quantity", "Secondary Unit", "Secondary Quantity", 
    // "Length", "Width", "Thickness", "Min Order Quantity", "Covering Unit", "Covering Quantity", 
    // "Conversion", "Status"
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    // Array to hold all processed (inserted or updated) product records
    const processedRecords = [];

    // Process each record (row) from the CSV file
    for (const record of records) {
      // Map CSV headers to your Product model fields.
      // Adjust the mapping below if your CSV headers or model field names differ.
      const data = {
        product_name: record['Product Name'] || record.product_name,
        alias: record['Alias'] || record.alias,
        hsn_code: record['HSN Code'] || record.hsn_code,
        marketers_id: record['Marketer '] || record.marketers_id,
        gst_percent_id: record['Gst Percent'] || record.gst_percent_id,
        product_category_id: record['Product Category Name'] || record.product_category_id,
        product_sub_category_id: record['Product Sub Category Name'] || record.product_sub_category_id,
        product_class_id: record['Class Name'] || record.product_class_id,
        brands_id: record['Brand Name'] || record.brands_id,
        primary_unit_id: record['Primary Unit'] || record.primary_unit_id,
        primary_quantity: record['Primary Quantity'] || record.primary_quantity,
        secondary_unit_id: record['Secondary Unit'] || record.secondary_unit_id,
        secondary_quantity: record['Secondary Quantity'] || record.secondary_quantity,
        length: record['Length'] || record.length,
        with: record['Width'] || record.with,
        thickness: record['Thickness'] || record.thickness,
        minimum_order_quantity: record['Min Order Quantity'] || record.minimum_order_quantity,
        covering_unit: record['Covering Unit'] || record.covering_unit,
        covering_quantity: record['Covering Quantity'] || record.covering_quantity,
        conversion: record['Conversion'] || record.conversion,
        active_status: record['Status'] || record.active_status
      };

      // Use hsn_code as the unique identifier.
      let product = await Product.query((qb) => {
        qb.where('hsn_code', data.hsn_code)
          .whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive]);
      }).fetch({ require: false });

      if (product) {
        // Update existing product with new data (patch update)
        product = await product.save(data, { patch: true });
      } else {
        // Insert new product record
        product = await new Product(data).save();
      }
      processedRecords.push(product);
    }

    // Optionally, remove the uploaded CSV file after processing
    fs.unlinkSync(filePath);

    return res.success({ message: 'Products imported successfully', products: processedRecords });
  } catch (error) {
    console.error('Error in product import:', error);
    return res.serverError(500, { error: error.toString() });
  }
};
