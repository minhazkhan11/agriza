'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const BeIdentityTable = require('../../../../../models/be_identity_table');

module.exports = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    console.log("User ID:", user_id);

    const be_id = req.body.be_information.be_id;
    const updateData = req.body.be_information;

    const record = await BeIdentityTable
      .query(qb => {
        qb.where({ be_id }).andWhere({ added_by: user_id });
      })
      .fetch({ require: false });

    if (!record) {
      return res.serverError(400, ErrorHandler('Record not found or not authorized to update.'));
    }

    const updated = await record.save(updateData, { patch: true });

    return res.success({ be_information: updated });

  } catch (error) {
    console.error("Error updating BeIdentityTable:", error);
    return res.serverError(500, ErrorHandler(error));
  }
};
