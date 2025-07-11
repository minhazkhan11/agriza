'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Marketers = require('../../../../../models/marketers');
const Attachment = require('../../../../../models/attachments');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
    try {
        const marketer = await Marketers.query(qb => {
            qb.where({ id: req.params.id })
                .whereIn('active_status', ['pending','active', 'inactive','cancelled']);
        }).fetch({ require: false });
        if (!marketer) {
            return res.serverError(400, 'Invalid marketer');
        }

        let marketerData = marketer.toJSON();


        const attachment = await Attachment.where({
            entity_id: marketer.id,
            entity_type: 'marketer_photo',
            active_status: constants.activeStatus.active
        }).fetch({ require: false });


        marketerData.photo = attachment ? attachment.get('photo_path') : null;

        return res.success({ marketers: marketerData });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
