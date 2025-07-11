'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Order_Payments = require('../../../../../models/order_payments');
const Attachment = require('../../../../../models/attachments');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
    try {
        let body = req.body.order_payments;
        const id = body.id;
        const orderImagePath = body.payments_image;
        delete body.payments_image;

        if (!id) {
            return res.serverError(400, 'Order Payment ID is required');
        }

        const existingPayment = await Order_Payments.where({ id }).fetch({ require: false });

        if (!existingPayment) {
            return res.serverError(400, 'Order Payment not found');
        }

        body.updated_at = new Date();
        await existingPayment.save(body, { patch: true });


        if (orderImagePath) {

            await Attachment.query((qb) => {
                qb.where('entity_id', id)
                    .andWhere('entity_type', 'payments_image')
                    .andWhere('active_status', constants.activeStatus.active);
            }).save(
                { active_status: constants.activeStatus.inactive },
                { patch: true, method: 'update' }
            );


            await new Attachment({
                entity_id: id,
                entity_type: 'payments_image',
                photo_path: orderImagePath,
                added_by: req.user.id,
                active_status: constants.activeStatus.active
            }).save();
        }

        return res.success({ message: 'Order Payment updated successfully' });

    } catch (error) {
        return res.serverError(500, { error: ErrorHandler(error) });
    }
};
