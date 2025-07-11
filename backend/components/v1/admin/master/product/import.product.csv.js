'use strict';

const fs = require('fs');
const { parse } = require('csv-parse/sync');
const path = require('path');
const Product = require('../../../../../models/product');
const ProductClass = require('../../../../../models/product_class');
const ProductCategory = require('../../../../../models/product_category');
const ProductSubCategory = require('../../../../../models/product_sub_category');
const Brand = require('../../../../../models/brand');
const Marketers = require('../../../../../models/marketers');
const Gst = require('../../../../../models/gst_percent');
const Units = require('../../../../../models/units');
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
    // Assumes that the CSV file has headers.
    // Expected headers (example):
    // "Product Name", "Alias", "HSN Code", "Class Name", "Product Category Name",
    // "Product Sub Category Name", "Brand Name", "Marketer", "Gst Percent",
    // "Primary Unit", "Primary Quantity", "Secondary Unit", "Secondary Quantity",
    // "Length", "Width", "Thickness", "Min Order Quantity", "Covering Unit",
    // "Covering Quantity", "Conversion", "Status"
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });

    // Array to hold all processed product records
    const processedRecords = [];

    // Process each record (row) from the CSV file
    for (const record of records) {
      // Map CSV fields to local variables
      const productName = record['Product Name'] || record.product_name;
      const alias = record['Alias'] || record.alias;
      const hsnCode = record['HSN Code'] || record.hsn_code;
      const className = record['Class Name'];
      const categoryName = record['Product Category Name'];
      const subCategoryName = record['Product Sub Category Name'];
      const brandName = record['Brand Name'];
      const marketerName = record['Marketer'] || record['Marketer '];
      const gstPercent = record['Gst Percent'];
      const primaryUnitName = record['Primary Unit'];
      const primaryQuantity = record['Primary Quantity'] || record.primary_quantity;
      const secondaryUnitName = record['Secondary Unit'];
      const secondaryQuantity = record['Secondary Quantity'] || record.secondary_quantity;
      const length = record['Length'] || record.length;
      const width = record['Width'] || record.with;
      const thickness = record['Thickness'] || record.thickness;
      const minOrderQty = record['Min Order Quantity'] || record.minimum_order_quantity;
      const coveringUnit = record['Covering Unit'] || record.covering_unit;
      const coveringQuantity = record['Covering Quantity'] || record.covering_quantity;
      const conversion = record['Conversion'] || record.conversion;
      const status = record['Status'] || record.active_status;

      // --- Lookup or Insert Related Entities ---

      // ProductClass
      let productClass = await ProductClass.where({ class_name: className }).fetch({ require: false });
      if (!productClass) {
        productClass = await new ProductClass({ class_name: className }).save();
      }
      const product_class_id = productClass.id;

      // ProductCategory (associate with product_class_id)
      let productCategory = await ProductCategory.where({ category_name: categoryName }).fetch({ require: false });
      if (!productCategory) {
        productCategory = await new ProductCategory({ category_name: categoryName, product_class_id }).save();
      }
      const Product_category_id = productCategory.id;

      // ProductSubCategory (associate with product_category_id)
      let productSubCategory = await ProductSubCategory.where({ product_sub_category_name: subCategoryName }).fetch({ require: false });
      if (!productSubCategory) {
        productSubCategory = await new ProductSubCategory({ product_sub_category_name: subCategoryName, Product_category_id }).save();
      }
      const product_sub_category_id = productSubCategory.id;

      // Brand
      let brand = await Brand.where({ brand_name: brandName }).fetch({ require: false });
      if (!brand) {
        brand = await new Brand({ brand_name: brandName }).save();
      }
      const brands_id = brand.id;

      // Marketers
      let marketer = await Marketers.where({ marketer_name: marketerName }).fetch({ require: false });
      if (!marketer) {
        marketer = await new Marketers({ marketer_name: marketerName }).save();
      }
      const marketers_id = marketer.id;

      // Gst
      let gst = await Gst.where({ gst_percent: gstPercent }).fetch({ require: false });
      if (!gst) {
        gst = await new Gst({ gst_percent: gstPercent }).save();
      }
      const gst_percent_id = gst.id;

      // Primary Unit
      let primaryUnit = await Units.where({ unit_name: primaryUnitName }).fetch({ require: false });
      if (!primaryUnit) {
        primaryUnit = await new Units({ unit_name: primaryUnitName }).save();
      }
      const primary_unit_id = primaryUnit.id;

      // Secondary Unit
      let secondaryUnit = await Units.where({ unit_name: secondaryUnitName }).fetch({ require: false });
      if (!secondaryUnit) {
        secondaryUnit = await new Units({ unit_name: secondaryUnitName }).save();
      }
      const secondary_unit_id = secondaryUnit.id;

      // --- Prepare the Product Data Object ---
      const productData = {
        product_name: productName,
        alias: alias,
        hsn_code: hsnCode,
        marketers_id: marketers_id,
        gst_percent_id: gst_percent_id,
        product_category_id: Product_category_id,
        product_sub_category_id: product_sub_category_id,
        product_class_id: product_class_id,
        brands_id: brands_id,
        primary_unit_id: primary_unit_id,
        primary_quantity: primaryQuantity,
        secondary_unit_id: secondary_unit_id,
        secondary_quantity: secondaryQuantity,
        length: length,
        with: width,
        thickness: thickness,
        minimum_order_quantity: minOrderQty,
        covering_unit: coveringUnit,
        covering_quantity: coveringQuantity,
        conversion: conversion,
        active_status: status
      };

      // --- Update or Insert the Product ---
      // Use hsn_code as the unique identifier
      let product = await Product.query((qb) => {
        qb.where('hsn_code', productData.hsn_code)
          .whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive]);
      }).fetch({ require: false });

      if (product) {
        // Update existing product with new data (patch update)
        product = await product.save(productData, { patch: true });
      } else {
        // Insert new product record
        product = await new Product(productData).save();
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
