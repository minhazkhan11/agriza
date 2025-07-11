'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Bankdetails = require('../../../../../models/be_bank_details');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    let bankDetailsArr = req.body.bankdetails;

    // Validate input: it should be a non-empty array.
    if (!Array.isArray(bankDetailsArr) || bankDetailsArr.length === 0) {
      return res.serverError(
        400,
        ErrorHandler('Invalid input data format. bankdetails should be a non-empty array.')
      );
    }

    const added_by = req.user.id;
    const bankAccountNumbers = bankDetailsArr.map(item => item.bank_account_number);

    // Fetch existing records for provided bank_account_numbers.
    const existingRecordsCollection = await Bankdetails.query((qb) => {
      qb.whereIn('bank_account_number', bankAccountNumbers)
        .whereIn('active_status', ['active', 'inactive']);
    }).fetchAll({ require: false });

    // Create a mapping for quick lookup: bank_account_number => record.
    const existingRecordsMap = {};
    if (existingRecordsCollection && existingRecordsCollection.length > 0) {
      existingRecordsCollection.forEach(record => {
        const bankAcc = record.get('bank_account_number');
        existingRecordsMap[bankAcc] = record;
      });
    }

    const processedRecords = [];

    // Process each bank detail.
    for (const detail of bankDetailsArr) {
      // Skip any record without a bank_account_number.
      if (!detail.bank_account_number) {
        continue;
      }

      if (existingRecordsMap[detail.bank_account_number]) {
        // Record exists: update it.
        const existingRecord = existingRecordsMap[detail.bank_account_number];
        await existingRecord.save(detail, { patch: true });
        processedRecords.push({
          bankdetails: existingRecord
        });
      } else {
        // Record does not exist: insert a new record.
        detail.added_by = added_by;
        const newRecord = await new Bankdetails(detail).save();
        processedRecords.push({
          bankdetails: newRecord
        });
      }
    }

    return res.success({
      bankdetails: processedRecords.map(record => record.bankdetails)
    });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
