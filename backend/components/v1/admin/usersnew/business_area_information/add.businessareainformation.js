
'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Businessinformation = require('../../../../../models/be_area_information');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
  try {
    const { business_information } = req.body;


    if (!Array.isArray(business_information) || business_information.length === 0) {
      return res.serverError(400, ErrorHandler('Invalid input data format'));
    }

    const added_by = req.user.id;
    const processedRecords = [];


    for (const info of business_information) {
      if (!info.person_phone) {
        continue;
      }

      // Ensure foreign key fields are NULL if not provided
      info.state_id = info.state_id || null;
      info.district_id = info.district_id || null;
      info.tehsil_id = info.tehsil_id || null;
      info.pin_id = info.pin_id || null;
      info.place_id = info.place_id || null;
      info.added_by = added_by;

      // Check if a record with the same person_phone exists (active or inactive).
      const existingRecord = await Businessinformation.query((qb) => {
        qb.where('person_phone', info.person_phone)
          .whereIn('active_status', ['active', 'inactive']);
      }).fetch({ require: false });

      if (existingRecord) {
        const updatedRecord = await existingRecord.save(info, { patch: true });
        processedRecords.push(updatedRecord);
      } else {

        const insertedRecord = await new Businessinformation(info).save();
        processedRecords.push(insertedRecord);
      }
    }

    return res.success({ business_information: processedRecords });
  } catch (error) {
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};
