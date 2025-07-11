'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Activity = require('../../../../../models/order_activity');
const { constants } = require('../../../../../config');

module.exports = async (req, res) => {
    try {
        const order_activity = await Activity.query((qb) => {
            qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
                .andWhere({ id: req.params.id })
        }).fetch({
            require: false,
            withRelated: [{
                'activity_image': function (qb) {
                    qb.where('active_status', 'active').select('id', 'photo_path', 'entity_id')// customize as needed
                }
            },

            {
                'be_information_customer': function (qb) {
                    qb.select('id', 'business_name'); // customize as needed
                }
            }]
        });

        return res.success({
            order_activity
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
