
'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Order = require('../../../../../models/order_so_po');
const OrderItem = require('../../../../../models/order_item');
const ItemVariantsStock = require('../../../../../models/item_variants_stock');
const ItemVariants = require('../../../../../models/item_variants');
const Product = require('../../../../../models/product');
const Dispatch = require('../../../../../models/order_dispatch');
const Quantity = require('../../../../../models/dispatch_quantity');
const Attachment = require('../../../../../models/attachments');
const { constants } = require('../../../../../config');

function generateSKU(product_name = 'ITEM') {
  const shortProduct = product_name.replace(/\s+/g, '').toUpperCase().slice(0, 5);
  const timestamp = Date.now().toString().slice(-3);
  return `${shortProduct}${timestamp}`;
}

async function generateUniqueSKU(product_name) {
  let sku;
  let exists = true;
  while (exists) {
    sku = generateSKU(product_name);
    const existing = await ItemVariantsStock.where({ sku_code: sku }).fetch({ require: false });
    exists = !!existing;
  }
  return sku;
}

module.exports = async (req, res, next) => {
  try {
    const {
      id,
      order_status,
      bilty_number,
      order_invoice_number,
      transporter_name,
      transporter_contact_number,
      payment_type,
      driver_name,
      driver_contact_number,
      vehicle_number,
      broker_details,
      freight,
      note,
      item_order = []
    } = req.body.order;

    const existingOrder = await Order.where({ id }).fetch({ require: false });
    if (!existingOrder) return res.serverError(400, ErrorHandler('Order not found'));

    const item_order_id = existingOrder.get('item_order_id');
    const ship_type = existingOrder.get('ship_type');

    const orderItems = await OrderItem.where({ item_order_id }).fetchAll({ require: false });
    const orderItemsMap = orderItems.reduce((map, item) => {
      map[item.get('item_variants_id')] = item;
      return map;
    }, {});

    let createdStocks = [];

    for (const input of item_order) {
      const { item_variants_id, dispatch_quantity } = input;
      if (!item_variants_id || !dispatch_quantity) continue;

      const orderItem = orderItemsMap[item_variants_id];
      if (!orderItem) continue;

      const order_item_id = orderItem.get('id');

      const variant = await ItemVariants.where({ id: item_variants_id }).fetch({ require: false });

      let product_name = 'ITEM';
      if (variant) {
        const item_id = variant.get('item_id');
        const product = await Product.where({ id: item_id }).fetch({ require: false });
        product_name = product ? product.get('product_name') : 'ITEM';
      }

      // Stock out
      const skuOut = await generateUniqueSKU(product_name);
      const stockOut = await new ItemVariantsStock({
        item_variants_id,
        stock: dispatch_quantity,
        sku_code: skuOut,
        stock_status: 'out',
        added_by: req.user.id
      }).save();
      createdStocks.push(stockOut);

      // Drop shipping stock in
      if (ship_type === 'dropshipping') {
        const skuIn = await generateUniqueSKU(product_name);
        const stockIn = await new ItemVariantsStock({
          item_variants_id,
          stock: dispatch_quantity,
          sku_code: skuIn,
          stock_status: 'in',
          added_by: req.user.id
        }).save();
        createdStocks.push(stockIn);
      }

      // Quantity Entry Logic
      const latestQuantity = await Quantity
        .where({ order_item_id })
        .orderBy('id', 'DESC')
        .fetch({ require: false });

      if (latestQuantity) {
        const previousDispatch = parseFloat(latestQuantity.get('all_dispatch_quantity') || 0);
        const newDispatch = parseFloat(dispatch_quantity);
        await new Quantity({
          item_order_id,
          order_item_id,
          dispatch_quantity: newDispatch,
          all_dispatch_quantity: previousDispatch + newDispatch,
          added_by: req.user.id
        }).save();
      } else {
        await new Quantity({
          item_order_id,
          order_item_id,
          dispatch_quantity,
          all_dispatch_quantity: dispatch_quantity,
          added_by: req.user.id
        }).save();
      }
    }

    await Order.query().where({ item_order_id }).update({ order_status });

    // // Dispatch Entry Logic: Match all fields; create new if any one mismatches
    // const dispatchFields = {
    //   item_order_id,
    //   bilty_number,
    //   order_invoice_number,
    //   transporter_name,
    //   transporter_contact_number,
    //   payment_type,
    //   driver_name,
    //   driver_contact_number,
    //   vehicle_number,
    //   broker_details,
    //   freight,
    //   note,
    //   added_by: req.user.id
    // };

    // const existingMatchingDispatch = await Dispatch.where(dispatchFields).fetch({ require: false });

    // let dispatchEntry;
    // if (!existingMatchingDispatch) {
    //   dispatchEntry = await new Dispatch(dispatchFields).save();
    // } else {
    //   dispatchEntry = existingMatchingDispatch;
    // }
    // if (req.body.order.dispatch_image) {
    //   const existingImage = await Attachment
    //     .where({
    //       entity_id: dispatchEntry.get('id'),
    //       entity_type: 'dispatch_image',
    //       active_status: constants.activeStatus.active
    //     })
    //     .fetch({ require: false });

    //   if (!existingImage || existingImage.get('photo_path') !== req.body.order.dispatch_image) {
    //     if (existingImage) {
    //       await existingImage.save(
    //         { active_status: constants.activeStatus.inactive },
    //         { patch: true }
    //       );
    //     }

    //     await new Attachment({
    //       entity_id: dispatchEntry.get('id'),
    //       entity_type: 'dispatch_image',
    //       photo_path: req.body.order.dispatch_image,
    //       active_status: constants.activeStatus.active,
    //       added_by: req.user.id,
    //     }).save();
    //   }
    // }


    // Always create a new Dispatch Entry
    const dispatchFields = {
      item_order_id,
      bilty_number,
      order_invoice_number,
      transporter_name,
      transporter_contact_number,
      payment_type,
      driver_name,
      driver_contact_number,
      vehicle_number,
      broker_details,
      freight,
      note,
      added_by: req.user.id
    };

    // Directly create a new dispatch
    const dispatchEntry = await new Dispatch(dispatchFields).save();

    // Handle dispatch image upload
    if (req.body.order.dispatch_image) {
      await new Attachment({
        entity_id: dispatchEntry.id,
        entity_type: 'dispatch_image',
        photo_path: req.body.order.dispatch_image, // Assuming S3 path or file URL
        active_status: constants.activeStatus.active,
        added_by: req.user.id
      }).save();
    }

    const updatedOrders = await Order.where({ item_order_id }).fetchAll({ require: false });

    const quantityData = await Quantity.where({ item_order_id }).fetchAll({ require: false });

    return res.success({
      message: "Order, dispatch, stock, and dispatch quantity updated successfully",
      updated_orders: updatedOrders,
      created_stocks: createdStocks,
      dispatch: dispatchEntry,
      quantity_data: quantityData
    });

  } catch (error) {
    console.error('Error:', error);
    return res.serverError(500, ErrorHandler(error));
  }
};
