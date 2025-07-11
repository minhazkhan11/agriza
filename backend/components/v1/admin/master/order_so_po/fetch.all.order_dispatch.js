'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Order = require('../../../../../models/order_so_po');
const OrderItem = require('../../../../../models/order_item');
const Discount = require('../../../../../models/totaldiscount');
const OtherCharges = require('../../../../../models/other_charges');
const ItemVariants = require('../../../../../models/item_variants');
const ItemVariantsStock = require('../../../../../models/item_variants_stock');
const Product = require('../../../../../models/product');
const Dispatch = require('../../../../../models/order_dispatch');
const Quantity = require('../../../../../models/dispatch_quantity');
const Attachment = require('../../../../../models/attachments');
const { constants } = require('../../../../../config');

module.exports = async (req, res, next) => {
  try {
    const orders = await Order.query(qb => {
      qb.where('order_type', 'so')
        .whereIn('order_status', [
          'dispatch',
          'delivered',
          'partial_dispatch',
        ]);
    }).fetchAll({ require: false });

    const finalData = [];

    for (const order of orders.toJSON()) {
      const item_order_id = order.item_order_id;

      const [items, discounts, charges, dispatchQuantities, dispatch, orderImage] = await Promise.all([
        OrderItem.where({ item_order_id }).orderBy('id', 'DESC').fetchAll({ require: false }),
        Discount.where({ item_order_id }).orderBy('id', 'DESC').fetchAll({ require: false }),
        OtherCharges.where({ item_order_id }).orderBy('id', 'DESC').fetchAll({ require: false }),
        Quantity.where({ item_order_id }).orderBy('id', 'DESC').fetchAll({ require: false }),
        Dispatch.where({ item_order_id }).orderBy('id', 'DESC').fetch({ require: false }),
        Attachment.where({
          entity_id: order.id,
          entity_type: 'order_image',
          active_status: constants.activeStatus.active
        }).fetch({ require: false })
      ]);

      const itemData = [];

      for (const item of items.toJSON()) {
        const variant = await ItemVariants.where({ id: item.item_variants_id }).fetch({ require: false });

        let product = null;
        let item_id = null;

        if (variant) {
          item_id = variant.get('item_id');
          product = await Product.where({ id: item_id }).fetch({ require: false });
        }

        const stocks = await ItemVariantsStock.where({
          item_variants_id: item.item_variants_id,
          stock_status: 'out'
        }).fetchAll({ require: false });

        const productImage = item_id
          ? await Attachment.where({
            entity_id: item_id,
            entity_type: 'product_image',
            active_status: constants.activeStatus.active
          }).fetch({ require: false })
          : null;

        itemData.push({
          ...item,
          variant: variant?.toJSON() || null,
          product_name: product?.get('product_name') || null,
          stocks: stocks?.toJSON() || [],
          product_image: productImage?.get('photo_path') || null
        });
      }

      let dispatchData = dispatch?.toJSON() || null;
      if (dispatch) {
        const dispatchImage = await Attachment.where({
          entity_id: dispatch.get('id'),
          entity_type: 'dispatch_image',
          active_status: constants.activeStatus.active
        }).fetch({ require: false });

        dispatchData = {
          ...dispatchData,
          dispatch_image: dispatchImage?.get('photo_path') || null
        };
      }

      finalData.push({
        ...order,
        items: itemData,
        discounts: discounts?.toJSON() || [],
        other_charges: charges?.toJSON() || [],
        dispatch_quantities: dispatchQuantities?.toJSON() || [],
        dispatch: dispatchData,
        order_image: orderImage?.get('photo_path') || null
      });
    }

    return res.success({
      message: 'All orders fetched successfully with dispatch, delivered, partial_dispatch Orders',
      orders: finalData
    });

  } catch (error) {
    console.error('Error in fetch all orders:', error);
    return res.serverError(500, 'Something went wrong while fetching orders');
  }
};
