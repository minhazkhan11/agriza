'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const BeIdentityTable = require('../../../../../models/be_identity_table');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const user_id = req.user.id;

    const check = await BeIdentityTable
      .query(qb => {
        qb.where('be_id', req.params.id).andWhere('added_by', user_id);
      })
      .fetch({ require: false });

    if (!check) {
      return res.serverError(400, ErrorHandler(new Error('BeIdentityTable details not found')));
    }

    await BeIdentityTable
      .where({ be_id: req.params.id })
      .save({ active_status: constants.activeStatus.deleted }, { method: 'update' });

    return res.success({ message: 'BeIdentityTable details deleted successfully' });

  } catch (error) {
    console.log('errorrr', error);
    return res.serverError(500, ErrorHandler(error));
  }
};
