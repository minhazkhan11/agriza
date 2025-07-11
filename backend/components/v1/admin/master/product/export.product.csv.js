'use strict';

const fs = require('fs');
const path = require('path');
const { stringify } = require('csv-stringify/sync');
const Product = require('../../../../../models/product');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    // Fetch all active products with related product_sub_category
    const products = await Product.where({ active_status: constants.activeStatus.active })
      .fetchAll({
        require: false,
        withRelated: [{
          'product_category_id': function (query) {
            query.select('id', 'category_name');
          }
        }, {
          'product_sub_category_id': function (query) {
            query.select('id', 'product_sub_category_name');
          }
        },
        {
          'marketers_id': function (query) {
            query.select('id', 'marketer_name');
          }
        },
        {
          'brands_id': function (query) {
            query.select('id', 'brand_name');
          }
        },
        {
          'product_class_id': function (query) {
            query.select('id', 'class_name');
          }
        },
        {
          'gst_percent_id': function (query) {
            query.select('id', 'gst_percent');
          }
        }]
      });

    if (!products || products.length === 0) {
      return res.success({ message: 'No products found for export.' });
    }

    let productsArray = [];
    let serial_number = 1;

    for (const product of products) {
      let productData = product.toJSON();
      productsArray.push({
        serial_number: serial_number,
        product_name: productData.product_name,
        alias: productData.alias,
        hsn_code: productData.hsn_code,
        marketers_id: productData.marketers_id?.marketer_name,
        gst_percent_id: productData.gst_percent_id?.gst_percent,
        product_category_id: productData.product_category_id?.category_name,
        product_sub_category_id: productData.product_sub_category_id?.product_sub_category_name,
        product_class_id: productData.product_class_id?.class_name,
        brands_id: productData.brands_id?.brand_name,
        primary_unit_id: productData.primary_unit_id,
        primary_quantity: productData.primary_quantity,
        secondary_unit_id: productData.secondary_unit_id,
        secondary_quantity: productData.secondary_quantity,
        length: productData.length,
        with: productData.with,
        thickness: productData.thickness,
        minimum_order_quantity: productData.minimum_order_quantity,
        covering_unit: productData.covering_unit,
        covering_quantity: productData.covering_quantity,
        conversion: productData.conversion,
        active_status: productData.active_status,
      });
      serial_number++;
    }

    // Convert productsArray to CSV
    const csvData = stringify(productsArray, {
      header: true,
      columns: {
        serial_number: 'Serial Number',
        product_name: 'Product Name',
        alias: 'Alias',
        hsn_code: 'HSN Code',
        marketers_id: 'Marketer ',
        gst_percent_id: 'Gst Percent',
        product_category_id: 'Product Category Name',
        product_sub_category_id: 'Product Sub Category Name',
        product_class_id: 'Class Name',
        brands_id: 'Brand Name',
        primary_unit_id: 'Primary Unit',
        primary_quantity: 'Primary Quantity',
        secondary_unit_id: 'Secondary Unit',
        secondary_quantity: 'Secondary Quantity',
        length: 'Length',
        with: 'Width',
        thickness: 'Thickness',
        minimum_order_quantity: 'Min Order Quantity',
        covering_unit: 'Covering Unit',
        covering_quantity: 'Covering Quantity',
        conversion: 'Conversion',
        active_status: 'Status',
      }
    });

    // Define the directory path
    const directoryPath = path.join(__dirname, '../../../../../public/uploads/exports');

    // Ensure directory exists
    if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true });
    }

    // Write CSV data to a file
    const filePath = path.join(directoryPath, 'products.csv');
    fs.writeFileSync(filePath, csvData);

    // Prepare file response
    res.setHeader('Content-Disposition', 'attachment; filename=products.csv');
    res.setHeader('Content-Type', 'text/csv');
    res.sendFile(filePath, (err) => {
      if (err) {
        next(err);
      } else {
        fs.unlinkSync(filePath); // Delete file after sending
      }
    });

    const newUrl = filePath.split('public');
    const file_url = process.env.BASE_URL + newUrl[1];

    return res.success({
      message: 'Products exported successfully', file_url
    });
  } catch (error) {
    console.error('Error in product export:', error);
    return res.serverError(500);
  }
};
