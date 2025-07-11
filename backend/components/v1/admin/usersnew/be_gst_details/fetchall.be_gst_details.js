'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Gst = require('../../../../../models/be_gst_details');

const { constants } = require('../../../../../config');


module.exports = async (req, res, next) => {
  try {
    const be_gst_details = await Gst.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      withRelated: [
        'gst_file',
        {
          'pin_id': function (query) {
            query.select('id', 'pin_code');
          }
        },
        {
          'place_id': function (query) {
            query.select('id', 'place_name');
          }
        }
      ],
    });

    const count = be_gst_details.length;

    return res.success({
      be_gst_details, count
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};