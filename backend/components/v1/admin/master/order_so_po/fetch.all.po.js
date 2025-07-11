'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Order = require('../../../../../models/order_so_po');
const OrderItem = require('../../../../../models/order_item');
const Discount = require('../../../../../models/totaldiscount');
const OtherCharges = require('../../../../../models/other_charges');
const Attachment = require('../../../../../models/attachments');

module.exports = async (req, res) => {
    try {
        // Fetch only PO type orders
        const orders = await Order.query(qb => {
            qb.where('order_type', 'po');
        }).fetchAll({
            require: false,
            withRelated: [
                {
                    'customer_be': (qb) => qb.select('id', 'business_name')
                },
                {
                    'vendor_be': (qb) => qb.select('id', 'business_name')
                },
                {
                    'warehouse': (qb) => qb.select('id', 'name', 'address')
                },
                {
                    'vendor_warehouse': (qb) => qb.select('id', 'name', 'address')
                },
                {
                    'customer_ship_to_party': (qb) => qb.select('id', 'warehouse_name', 'warehouse_address', 'business_name', 'gst_no')
                }
            ]
        });

        const result = [];

        for (let order of orders.toJSON()) {
            const item_order_id = order.item_order_id;

            const items = await OrderItem.where({ item_order_id }).fetchAll({ require: false });
            const discounts = await Discount.where({ item_order_id }).fetchAll({ require: false });
            const otherCharges = await OtherCharges.where({ item_order_id }).fetchAll({ require: false });

            const image = await Attachment.where({
                entity_id: order.id,
                entity_type: 'order_image',
                active_status: 'active'
            }).fetch({ require: false });

            result.push({
                order,
                order_image: image ? image.get('photo_path') : null,
                order_items: items.toJSON(),
                discounts: discounts.toJSON(),
                other_charges: otherCharges.toJSON()
            });
        }

        return res.success({
            success: true,
            message: 'All PO orders fetched successfully',
            orders: result
        });

    } catch (error) {
        return res.serverError(500, ErrorHandler(error));
    }
};
