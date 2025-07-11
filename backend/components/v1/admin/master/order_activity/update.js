'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Activity = require('../../../../../models/order_activity');
const Attachment = require('../../../../../models/attachments');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
    try {
        let body = req.body.order_activity;
        const id = body.id;
        const orderImagePath = body.activity_image;
        delete body.activity_image;

        if (!id) {
            return res.serverError(400, 'order activity ID is required');
        }

        const existingactivity = await Activity.where({ id }).fetch({ require: false });

        if (!existingactivity) {
            return res.serverError(400, 'order activity not found');
        }

        body.updated_at = new Date();
        await existingactivity.save(body, { patch: true });


        if (orderImagePath) {

            await Attachment.query((qb) => {
                qb.where('entity_id', id)
                    .andWhere('entity_type', 'activity_image')
                    .andWhere('active_status', constants.activeStatus.active);
            }).save(
                { active_status: constants.activeStatus.inactive },
                { patch: true, method: 'update' }
            );


            await new Attachment({
                entity_id: id,
                entity_type: 'activity_image',
                photo_path: orderImagePath,
                added_by: req.user.id,
                active_status: constants.activeStatus.active
            }).save();
        }

        return res.success({ message: 'order activity updated successfully' });

    } catch (error) {
        return res.serverError(500, { error: ErrorHandler(error) });
    }
};
