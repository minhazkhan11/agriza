'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Uqc = require('../../../../../models/uqc');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const uqc = await Uqc.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .orderBy('created_at', 'asc');
    }).fetchAll({ require: false });

    const formattedUqc = uqc.map(item => ({
      id: item.get('id'),
      uqc_code: `${item.get('name')}-${item.get('quantity')}`
    }));

    return res.success({
      uqc: formattedUqc,
      count: formattedUqc.length
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
