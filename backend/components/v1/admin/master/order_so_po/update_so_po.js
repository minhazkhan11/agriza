'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Order = require('../../../../../models/order_so_po');
const OrderItem = require('../../../../../models/order_item');
const Discount = require('../../../../../models/totaldiscount');
const OtherCharges = require('../../../../../models/other_charges');
const Attachment = require('../../../../../models/attachments');

module.exports = async (req, res) => {
  try {
    const body = req.body.order;
    if (!body || !body.id) {
      return res.serverError(400, ErrorHandler("Order ID is required."));
    }


    const mainOrder = await Order.where({ id: body.id }).fetch({ require: false });
    if (!mainOrder) {
      return res.serverError(400, ErrorHandler("Order not found."));
    }

    const item_order_id = mainOrder.get('item_order_id');


    const relatedOrders = await Order.where({ item_order_id }).fetchAll({ require: false });
    if (!relatedOrders || relatedOrders.length === 0) {
      return res.serverError(400, ErrorHandler("No related orders found."));
    }

    const updateData = {
      ship_type: body.ship_type,
      customer_ship_to_party_id: body.customer_ship_to_party_id || null,
      vendor_warehouse_information_id: body.vendor_warehouse_information_id || null,
      total_amount: body.total_amount || null,
      payment_amount: body.payment_amount || 0,
      remaining_payment_after: body.remaining_payment_after || 0,
      payment_id: body.payment_id || null,
      payment_mode: body.payment_mode || null,
      payment_type: body.payment_type || null,
      date: body.date || null,
      warehouse_information_id: body.warehouse_information_id || null,
      customer_be_id: body.customer_be_id || null,
      vendor_be_id: body.vendor_be_id || null,
      admin_comment: body.admin_comment || null,
      general_comment: body.general_comment || null,
      remark: body.remark || null,
      order_status: body.order_status || 'received',
      active_status: body.active_status || 'active',
      added_by: req.user.id
    };


    for (const order of relatedOrders.models) {
      await order.save(updateData, { patch: true });
    }

 
    if (body.order_image) {
      for (const order of relatedOrders.models) {
        const currentImage = await Attachment.where({
          entity_id: order.id,
          entity_type: 'order_image',
          active_status: 'active'
        }).fetch({ require: false });

        const currentPath = currentImage ? currentImage.get('photo_path') : null;

        // Only update if path has changed
        if (currentPath !== body.order_image) {
          // Mark existing image inactive
          if (currentImage) {
            await currentImage.save({ active_status: 'inactive' }, { patch: true });
          }

          // Save new image
          await new Attachment({
            entity_id: order.id,
            entity_type: 'order_image',
            photo_path: body.order_image,
            active_status: 'active',
            added_by: req.user.id,
          }).save();
        }
      }
    }


    async function updateRecords(Model, list, fieldsMap) {
      const updated = [];
      if (Array.isArray(list)) {
        for (const data of list) {
          if (!data.id) continue;
          const rec = await Model.where({ id: data.id, item_order_id }).fetch({ require: false });
          if (!rec) continue;
          const patch = {};
          for (const field of fieldsMap) {
            if (data[field] !== undefined) patch[field] = data[field];
          }
          patch.added_by = req.user.id;
          const saved = await rec.save(patch, { patch: true });
          updated.push(saved.toJSON());
        }
      }
      return updated;
    }

    // 6. Update items, discounts, charges
    const updatedItems = await updateRecords(OrderItem, body.order_items, ['item_variants_id', 'quantity', 'price', 'discount_type', 'discount']);
    const updatedDiscounts = await updateRecords(Discount, body.discounts, ['total_discount_type', 'total_discount_name', 'total_discount']);
    const updatedCharges = await updateRecords(OtherCharges, body.other_charges, ['charges_name', 'charges']);

    // 7. Fetch final image for display (from main order)
    const activeImage = await Attachment.where({
      entity_id: mainOrder.id,
      entity_type: 'order_image',
      active_status: 'active'
    }).fetch({ require: false });

    const finalOrder = mainOrder.toJSON();
    finalOrder.order_image_url = activeImage ? activeImage.get('photo_path') : null;

    // 8. Fetch all updated related orders
    const updatedOrders = await Order.where({ item_order_id }).fetchAll({ require: false });
    const allOrdersJson = updatedOrders ? updatedOrders.toJSON() : [];

    // 9. Return all updated
    return res.success({
      success: true,
      message: "All related orders and records updated successfully.",
      main_order: finalOrder,
      all_orders: allOrdersJson,
      order_items: updatedItems,
      discounts: updatedDiscounts,
      other_charges: updatedCharges
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};
