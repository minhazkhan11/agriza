'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const SubExpense = require('../../../../../models/sub_expense');
const Attachment = require('../../../../../models/attachments');
const { constants } = require('../../../../../config');
const { uploadToS3Bucket, getObjectUrl } = require('../../../../../lib/utils/aws/s3');
const generateObjectKeyMultiple = require('../../../../../lib/utils/aws/s3/generateObjectKeyMultiple');

module.exports = async (req, res) => {
  try {
    let { sub_expense } = req.body;

    try {
      sub_expense = JSON.parse(sub_expense);
    } catch (err) {
      return res.serverError(400, ErrorHandler('Invalid JSON format in sub_expense data.'));
    }

    const { id } = sub_expense;

    if (!id) {
      return res.serverError(400, ErrorHandler('Missing sub_expense ID for update.'));
    }

    const existing = await SubExpense.where({ id }).fetch({ require: false });
    if (!existing) {
      return res.serverError(404, ErrorHandler('Sub expense not found.'));
    }

    sub_expense.added_by = req.user?.id || null;

    // Update sub_expense
    await existing.save(sub_expense, { patch: true });

    let expense_photo = null;

    // If new image is uploaded
    if (req.files?.expense_photo?.[0]) {
      const file = req.files.expense_photo[0];
      const objectKey = generateObjectKeyMultiple("Expense", "expense_photo", file.originalname);
      await uploadToS3Bucket(objectKey, file.buffer);
      const newPhotoPath = await getObjectUrl(objectKey);

      // Check if same image already exists and is active
      const existingActiveAttachment = await Attachment.where({
        entity_id: id,
        entity_type: 'expense_photo',
        active_status: 'active'
      }).fetch({ require: false });

      if (existingActiveAttachment && existingActiveAttachment.get('photo_path') === newPhotoPath) {
        // Same image already exists and is active — no need to update
        expense_photo = newPhotoPath;
      } else {
        // Inactivate old attachments
        const oldAttachments = await Attachment.query(qb => {
          qb.where({ entity_id: id, entity_type: 'expense_photo', active_status: 'active' });
        }).fetchAll();

        for (const att of oldAttachments.models) {
          await att.save({ active_status: 'inactive' }, { patch: true });
        }

        // Save new attachment as active
        await new Attachment({
          entity_id: id,
          entity_type: 'expense_photo',
          photo_path: newPhotoPath,
          added_by: req.user?.id || null,
          active_status: 'active'
        }).save();

        expense_photo = newPhotoPath;
      }
    }

    const updated = await SubExpense.where({ id }).fetch({ withRelated: ['expense_id'], require: false });
    const json = updated.toJSON();
    json.expense_photo = expense_photo;

    return res.success({ sub_expense: json });

  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
