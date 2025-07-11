'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const LicenseProduct = require('../../../../../models/license_product');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    const licenseProductsArr = req.body.license_product;

    // Validate input: it should be a non-empty array.
    if (!Array.isArray(licenseProductsArr) || licenseProductsArr.length === 0) {
      return res.serverError(
        400,
        ErrorHandler('Invalid input data format. license_products should be a non-empty array.')
      );
    }

    const added_by = req.user.id;
    const productNames = licenseProductsArr.map(item => item.name_of_product);

    // Fetch existing records for provided name_of_product values.
    const existingRecordsCollection = await LicenseProduct.query((qb) => {
      qb.whereIn('name_of_product', productNames)
        .whereIn('active_status', ['active', 'inactive']);
    }).fetchAll({ require: false });

    // Create a mapping for quick lookup: name_of_product => record.
    const existingRecordsMap = {};
    if (existingRecordsCollection && existingRecordsCollection.length > 0) {
      existingRecordsCollection.forEach(record => {
        const productName = record.get('name_of_product');
        existingRecordsMap[productName] = record;
      });
    }

    const processedRecords = [];

    // Process each license product.
    for (const product of licenseProductsArr) {
      // Skip any record without a name_of_product.
      if (!product.name_of_product) {
        continue;
      }

      if (existingRecordsMap[product.name_of_product]) {
        // Record exists: update it.
        const existingRecord = existingRecordsMap[product.name_of_product];
        await existingRecord.save(product, { patch: true });
        processedRecords.push({
          license_product: existingRecord
        });
      } else {
        // Record does not exist: insert a new record.
        product.added_by = added_by;
        const newRecord = await new LicenseProduct(product).save();
        processedRecords.push({
          license_product: newRecord
        });
      }
    }

    return res.success({
      license_product: processedRecords.map(record => record.license_product)
    });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
