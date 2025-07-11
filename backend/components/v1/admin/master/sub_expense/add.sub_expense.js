'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const SubExpense = require('../../../../../models/sub_expense');
const Attachment = require('../../../../../models/attachments');
const { constants } = require('../../../../../config');
const { uploadToS3Bucket, getObjectUrl } = require('../../../../../lib/utils/aws/s3');
const generateObjectKeyMultiple = require('../../../../../lib/utils/aws/s3/generateObjectKeyMultiple')

module.exports = async (req, res) => {
  try {
    let { sub_expense } = req.body;

    try {
      sub_expense = JSON.parse(sub_expense);
    } catch (err) {
      return res.serverError(400, ErrorHandler('Invalid JSON format in sub_expense data.'));
    }

    // Validate required fields
    if (!sub_expense.expense_id) {
      return res.serverError(400, ErrorHandler('Missing required fields:  expense_id'));
    }

    sub_expense.added_by = req.user?.id || null;

    // Save sub expense
    const savedSubExpense = await new SubExpense(sub_expense).save();

    // Handle file upload (photo)
    let expense_photo = null;
    if (req.files?.expense_photo?.[0]) {
      const file = req.files.expense_photo[0];
      const objectKey = generateObjectKeyMultiple("Expense", "expense_photo", file.originalname);
      await uploadToS3Bucket(objectKey, file.buffer);
      expense_photo = await getObjectUrl(objectKey);

      // Save photo as attachment
      await new Attachment({
        entity_id: savedSubExpense.id,
        entity_type: 'expense_photo',
        photo_path: expense_photo,
        added_by: req.user?.id || null
      }).save();
    }

    const subExpenseData = savedSubExpense.toJSON();
    subExpenseData.expense_photo = expense_photo;

    return res.success({ sub_expense: subExpenseData });

  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
