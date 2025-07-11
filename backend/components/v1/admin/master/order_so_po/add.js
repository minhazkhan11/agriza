// 'use strict';

// const { ErrorHandler } = require('../../../../../lib/utils');
// const Order = require('../../../../../models/order_so_po');
// const OrderItem = require('../../../../../models/order_item');
// const Discount = require('../../../../../models/totaldiscount');
// const OtherCharges = require('../../../../../models/other_charges');
// const Attachment = require('../../../../../models/attachments');

// const generateOrderId = async () => {
//   const lastOrder = await Order.query(qb => qb.orderBy('created_at', 'desc')).fetch({ require: false });
//   const lastId = lastOrder ? parseInt(lastOrder.get('id'), 10) : 0;
//   const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
//   return `ORD${timestamp}${String(lastId + 1).padStart(4, '0')}`;
// };
// const generateSOPOOrderId = async (orderType) => {
//   // Get current financial year suffix like "25-26"
//   const now = new Date();
//   const currentYear = now.getFullYear();
//   const currentMonth = now.getMonth(); // 0 = January

//   const fyStartYear = currentMonth < 3 ? currentYear - 1 : currentYear;
//   const fyEndYear = fyStartYear + 1;
//   const financialYear = `${String(fyStartYear).slice(-2)}-${String(fyEndYear).slice(-2)}`;

//   // Fetch last order with same order type and financial year
//   const lastOrder = await Order
//     .query(qb => {
//       qb.where('order_type', orderType)
//         .andWhere('so_po_order_id', 'like', `${orderType.toUpperCase()}-%/${financialYear}`)
//         .orderBy('created_at', 'desc');
//     })
//     .fetch({ require: false });

//   const lastId = lastOrder && lastOrder.get('so_po_order_id')
//     ? parseInt(lastOrder.get('so_po_order_id').split('-')[1].split('/')[0], 10)
//     : 0;

//   const nextId = String(lastId + 1).padStart(4, '0');
//   return `${orderType.toUpperCase()}-${nextId}/${financialYear}`;
// };



// module.exports = async (req, res) => {
//   try {
//     const body = req.body.order;
//     if (!body) return res.serverError(400, ErrorHandler("Order payload missing."));

//     const item_order_id = await generateOrderId();
//     const orders = [];
//     const items = [], discounts = [], charges = [];

//     // Determine order types based on ship_type
//     const orderTypes = body.ship_type === 'dropshipping' ? ['so', 'po'] : [body.order_type];

//     for (const type of orderTypes) {
//       const so_po_order_id = await generateSOPOOrderId(type);

//       const newOrder = await new Order({
//         order_type: type,
//         ship_type: body.ship_type,
//         item_order_id,
//         so_po_order_id,
//         customer_ship_to_party_id: body.customer_ship_to_party_id || null,
//         vendor_warehouse_information_id: body.vendor_warehouse_information_id || null,
//         total_amount: body.total_amount || null,
//         payment_amount: body.payment_amount || 0,
//         remaining_payment_after: body.remaining_payment_after || 0,
//         payment_id: body.payment_id || null,
//         payment_mode: body.payment_mode || null,
//         payment_type: body.payment_type || null,
//         date: body.date || null,
//         warehouse_information_id: body.warehouse_information_id || null,
//         customer_be_id: body.customer_be_id || null,
//         vendor_be_id: body.vendor_be_id || null,
//         admin_comment: body.admin_comment || null,
//         general_comment: body.general_comment || null,
//         remark: body.remark || null,
//         order_status: 'received',
//         added_by: req.user.id,
//       }).save();

//       const order_id = newOrder.get('id');
//       orders.push(newOrder);

//       // Save order image if path is provided
//       if (body.order_image) {
//         await new Attachment({
//           entity_id: order_id,
//           entity_type: 'order_image',
//           photo_path: body.order_image,
//           added_by: req.user.id,
//         }).save();
//       }


//       if (Array.isArray(body.items)) {
//         for (let item of body.items) {
//           const savedItem = await new OrderItem({
//             order_id,
//             item_variants_id: item.item_variants_id,
//             // offer: item.offer || 0,
//             // offer_type: item.offer_type,
//             quantity: item.quantity,
//             price: item.price,
//             discount_type: item.discount_type,
//             discount: item.discount || 0,
//             added_by: req.user.id,
//           }).save();
//           items.push(savedItem);
//         }
//       }

//       if (Array.isArray(body.total_discount)) {
//         for (let discount of body.total_discount) {
//           const savedDiscount = await new Discount({
//             order_id,
//             total_discount_type: discount.total_discount_type,
//             total_discount_name: discount.total_discount_name,
//             total_discount: discount.total_discount,
//             added_by: req.user.id,
//           }).save();
//           discounts.push(savedDiscount);
//         }
//       }

//       if (Array.isArray(body.other_charges)) {
//         for (let charge of body.other_charges) {
//           const savedCharge = await new OtherCharges({
//             order_id,
//             charges_name: charge.charges_name,
//             charges: charge.charges,
//             added_by: req.user.id,
//           }).save();
//           charges.push(savedCharge);
//         }
//       }


//     }
//     const finalOrders = [];

//     for (const order of orders) {
//       const orderData = order.toJSON();

//       const attachment = await Attachment
//         .where({ entity_id: orderData.id, entity_type: 'order_image' })
//         .fetch({ require: false });

//       orderData.order_image_url = attachment ? attachment.get('photo_path') : null;

//       finalOrders.push(orderData);
//     }

//     return res.success({
//       success: true,
//       message: body.ship_type === 'dropshipping' ? 'SO and PO orders created successfully' : 'Order created successfully',
//       orders: finalOrders,
//       order_items: items,
//       discounts,
//       other_charges: charges
//     });

//   } catch (error) {
//     return res.serverError(500, ErrorHandler(error));
//   }
// };
'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Order = require('../../../../../models/order_so_po');
const OrderItem = require('../../../../../models/order_item');
const Discount = require('../../../../../models/totaldiscount');
const OtherCharges = require('../../../../../models/other_charges');
const Attachment = require('../../../../../models/attachments');

const generateOrderId = async () => {
  const lastOrder = await Order.query(qb => qb.orderBy('created_at', 'desc')).fetch({ require: false });
  const lastId = lastOrder ? parseInt(lastOrder.get('id'), 10) : 0;
  const timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
  return `ORD${timestamp}${String(lastId + 1).padStart(4, '0')}`;
};

const generateSOPOOrderId = async (orderType) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const fyStartYear = currentMonth < 3 ? currentYear - 1 : currentYear;
  const fyEndYear = fyStartYear + 1;
  const financialYear = `${String(fyStartYear).slice(-2)}-${String(fyEndYear).slice(-2)}`;

  const lastOrder = await Order
    .query(qb => {
      qb.where('order_type', orderType)
        .andWhere('so_po_order_id', 'like', `${orderType.toUpperCase()}-%/${financialYear}`)
        .orderBy('created_at', 'desc');
    })
    .fetch({ require: false });

  const lastId = lastOrder && lastOrder.get('so_po_order_id')
    ? parseInt(lastOrder.get('so_po_order_id').split('-')[1].split('/')[0], 10)
    : 0;

  const nextId = String(lastId + 1).padStart(4, '0');
  return `${orderType.toUpperCase()}-${nextId}/${financialYear}`;
};

module.exports = async (req, res) => {
  try {
    const body = req.body.order;
    if (!body) return res.serverError(400, ErrorHandler("Order payload missing."));

    const item_order_id = await generateOrderId();
    const orders = [];

    const orderTypes = body.ship_type === 'dropshipping' ? ['so', 'po'] : [body.order_type];

    for (const type of orderTypes) {
      const so_po_order_id = await generateSOPOOrderId(type);

      const newOrder = await new Order({
        order_type: type,
        ship_type: body.ship_type,
        item_order_id, // same item_order_id for all related items
        so_po_order_id,
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
        order_status: 'received',
        added_by: req.user.id,
      }).save();

      orders.push(newOrder);

      // && type === 'so'
      if (body.order_image) {
        await new Attachment({
          entity_id: newOrder.get('id'),
          entity_type: 'order_image',
          photo_path: body.order_image,
          added_by: req.user.id,
        }).save();
      }
    }

    const items = [], discounts = [], charges = [];


    if (body.ship_type === 'dropshipping') {
      if (Array.isArray(body.items)) {
        for (let item of body.items) {
          const savedItem = await new OrderItem({
            item_order_id, // same item_order_id for dropshipping items
            item_variants_id: item.item_variants_id,
            quantity: item.quantity,
            offer: item.offer || 0,
            offer_type: item.offer_type,
            price: item.price,
            discount_type: item.discount_type,
            discount: item.discount || 0,
            unit: item.unit,
            added_by: req.user.id,
          }).save();
          items.push(savedItem);
        }
      }

      if (Array.isArray(body.total_discount)) {
        for (let discount of body.total_discount) {
          const savedDiscount = await new Discount({
            item_order_id, // same item_order_id for dropshipping discounts
            total_discount_type: discount.total_discount_type,
            total_discount_name: discount.total_discount_name,
            total_discount: discount.total_discount,
            added_by: req.user.id,
          }).save();
          discounts.push(savedDiscount);
        }
      }

      if (Array.isArray(body.other_charges)) {
        for (let charge of body.other_charges) {
          const savedCharge = await new OtherCharges({
            item_order_id, // same item_order_id for dropshipping charges
            charges_name: charge.charges_name,
            charges: charge.charges,
            added_by: req.user.id,
          }).save();
          charges.push(savedCharge);
        }
      }
    } else {
      // For non-dropshipping orders, create order items, discounts, and other charges normally
      if (Array.isArray(body.items)) {
        for (let item of body.items) {
          const savedItem = await new OrderItem({
            item_order_id: orders[0].get('item_order_id'),
            item_variants_id: item.item_variants_id,
            quantity: item.quantity,
            price: item.price,
            offer: item.offer || 0,
            offer_type: item.offer_type,
            discount_type: item.discount_type,
            unit: item.unit,
            discount: item.discount || 0,
            added_by: req.user.id,
          }).save();
          items.push(savedItem);
        }
      }

      if (Array.isArray(body.total_discount)) {
        for (let discount of body.total_discount) {
          const savedDiscount = await new Discount({
            item_order_id: orders[0].get('item_order_id'),
            total_discount_type: discount.total_discount_type,
            total_discount_name: discount.total_discount_name,
            total_discount: discount.total_discount,
            added_by: req.user.id,
          }).save();
          discounts.push(savedDiscount);
        }
      }

      if (Array.isArray(body.other_charges)) {
        for (let charge of body.other_charges) {
          const savedCharge = await new OtherCharges({
            item_order_id: orders[0].get('item_order_id'),
            charges_name: charge.charges_name,
            charges: charge.charges,
            added_by: req.user.id,
          }).save();
          charges.push(savedCharge);
        }
      }
    }

    const finalOrders = [];
    for (const order of orders) {
      const orderData = order.toJSON();

      const attachment = await Attachment
        .where({ entity_id: orderData.id, entity_type: 'order_image' })
        .fetch({ require: false });

      orderData.order_image_url = attachment ? attachment.get('photo_path') : null;

      finalOrders.push(orderData);
    }

    return res.success({
      success: true,
      message: body.ship_type === 'dropshipping' ? 'SO and PO created (shared items)' : 'Order created',
      orders: finalOrders,
      order_items: items,
      discounts,
      other_charges: charges
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};

