'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Gst = require('../../../../../models/be_gst_details');
const { constants } = require('../../../../../config');


module.exports = async (req, res, next) => {
  try {
    const be_gst_details = await Gst.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .andWhere({ id: req.params.id })
        .orderBy('created_at', 'asc');
    }).fetch({
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

    if (!be_gst_details)
      return res.serverError(400, 'invalid be_gst_details ');
    return res.success({ be_gst_details });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
