'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Beperson = require('../../../../../models/users');
const Beassigned = require('../../../../../models/assigned_to');

module.exports = async (req, res, next) => {
  try {
    const beId = req.params.id;
    const assignedRecords = await Beassigned.query((qb) => {
      qb.where({ be_information_id: beId });
    }).fetchAll({ require: false });

    if (!assignedRecords || assignedRecords.length === 0) {
      return res.success({ persons: [] });
    }
    const personIds = assignedRecords.toJSON().map(record => record.user_id).filter(id => id);

    if (personIds.length === 0) {
      return res.success({ persons: [] });
    }

    const persons = await Beperson.query((qb) => {
      qb.whereIn('id', personIds);
    }).fetchAll({ require: false });

    return res.success({
      message: "Persons linked to the given be_information_id",
      persons
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
