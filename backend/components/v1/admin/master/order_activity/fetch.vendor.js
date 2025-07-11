'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Activity = require('../../../../../models/order_activity');

module.exports = async (req, res) => {
    try {
        const order_activity = await Activity.query((qb) => {
            qb.whereIn('active_status', ['active', 'inactive'])
            .andWhere('entity_type', 'vendor')
                .orderBy('created_at', 'asc');
        }).fetchAll({
            require: false,
            withRelated: [{
                'activity_image': function (qb) {
                    qb.where('active_status', 'active').select('id', 'photo_path', 'entity_id'); // customize as needed
                }
            },
            {
                'be_information_customer': function (qb) {
                    qb.select('id', 'business_name'); // customize as needed
                }
            }]
        });

        const count = order_activity.length;

        return res.success({
            order_activity, count
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
