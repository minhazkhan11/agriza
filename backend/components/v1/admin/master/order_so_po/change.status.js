'use strict';
const { ErrorHandler } = require('../../../../../lib/utils');
const Order = require('../../../../../models/order_so_po');

module.exports = async (req, res, next) => {
  try {
    const { id, order_status, remark } = req.body.order;

    let existingOrder = await Order.where({ id }).fetch({ require: false });
    if (!existingOrder)
      return res.serverError(400, ErrorHandler('Order not found'));

    const item_order_id = existingOrder.get('item_order_id');


    await Order
      .query()
      .where({ item_order_id })
      .update({
        order_status,
        remark
      });

    const updatedOrders = await Order.where({ item_order_id }).fetchAll({ require: false });

    return res.success({
      message: "Order status and remark updated successfully",
      updated_orders: updatedOrders
    });
  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};

// 'use strict';

// const { ErrorHandler } = require('../../../../../lib/utils');
// const Order = require('../../../../../models/order_so_po');
// const OrderItem = require('../../../../../models/order_item');
// const ItemVariantsStock = require('../../../../../models/item_variants_stock');
// const ItemVariants = require('../../../../../models/item_variants');
// const Product = require('../../../../../models/product');

// function generateSKU(product_name = 'ITEM') {
//   const shortProduct = product_name.replace(/\s+/g, '').toUpperCase().slice(0, 5);
//   const timestamp = Date.now().toString().slice(-3);
//   return `${shortProduct}${timestamp}`;
// }

// async function generateUniqueSKU(product_name) {
//   let sku;
//   let exists = true;
//   while (exists) {
//     sku = generateSKU(product_name);
//     const existing = await ItemVariantsStock.where({ sku_code: sku }).fetch({ require: false });
//     exists = !!existing;
//   }
//   return sku;
// }

// module.exports = async (req, res, next) => {
//   try {
//     const { id, order_status, remark, stock } = req.body.order;
//     const existingOrder = await Order.where({ id }).fetch({ require: false });
//     if (!existingOrder)
//       return res.serverError(400, ErrorHandler('Order not found'));

//     const item_order_id = existingOrder.get('item_order_id');
//     const ship_type = existingOrder.get('ship_type');

//     const items = await OrderItem.where({ order_id: id }).fetchAll({ require: false });
//     const itemVariants = items ? items.toJSON() : [];

//     let createdStocks = [];

//     if (stock && itemVariants.length > 0) {
//       for (let item of itemVariants) {
//         const variant = await ItemVariants.where({ id: item.item_variants_id }).fetch({ require: false });

//         let product_name = 'ITEM';
//         let variant_name = 'VARIANT';

//         if (variant) {
//           variant_name = variant.get('variant_name') || 'VARIANT';

//           const item_id = variant.get('item_id');
//           if (item_id) {
//             const product = await Product.where({ id: item_id }).fetch({ require: false });
//             product_name = product ? product.get('product_name') : 'ITEM';
//           }
//         }


//         const skuout = await generateUniqueSKU(product_name);
//         const stockOut = await new ItemVariantsStock({
//           item_variants_id: item.item_variants_id,
//           stock,
//           sku_code: skuout,
//           stock_status: 'out',
//           added_by: req.user.id
//         }).save();
//         createdStocks.push(stockOut);


//         if (ship_type === 'dropshipping') {
//           const skuin = await generateUniqueSKU(product_name);
//           const stockIn = await new ItemVariantsStock({
//             item_variants_id: item.item_variants_id,
//             stock,
//             sku_code: skuin,
//             stock_status: 'in',
//             added_by: req.user.id
//           }).save();
//           createdStocks.push(stockIn);
//         }
//       }
//     } else {
//       console.log('Stock missing or no order items.');
//     }

//     await Order
//       .query()
//       .where({ item_order_id })
//       .update({ order_status, remark });

//     const updatedOrders = await Order.where({ item_order_id }).fetchAll({ require: false });


//     return res.success({
//       message: "Order status, remark, and stock (if given) updated successfully",
//       updated_orders: updatedOrders,
//       created_stocks: createdStocks
//     });
//   } catch (error) {
//     console.error('Error:', error);
//     return res.serverError(500, ErrorHandler(error));
//   }
// };
