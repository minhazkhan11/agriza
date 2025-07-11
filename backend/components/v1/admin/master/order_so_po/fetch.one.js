
'use strict';

const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
const Order = require('../../../../../models/order_so_po');
const OrderItem = require('../../../../../models/order_item');
const Discount = require('../../../../../models/totaldiscount');
const OtherCharges = require('../../../../../models/other_charges');
const Attachment = require('../../../../../models/attachments');
const Variant = require('../../../../../models/item_variants');
const Product = require('../../../../../models/product');

const ProductSubCategory = require('../../../../../models/product_sub_category');
const ProductCategory = require('../../../../../models/product_category');

module.exports = async (req, res) => {
  try {
    const id = req.params.id;

    const order = await Order.where({ id }).fetch({
      require: false,
      withRelated: [
        {
          'customer_be': query => query.select('id', 'business_name')
        },
        {
          'vendor_be': query => query.select('id', 'business_name')
        },
        {
          'warehouse': query => query.select('id', 'name', 'address')
        },
        {
          'vendor_warehouse': query => query.select('id', 'name', 'address')
        },
        {
          'customer_ship_to_party': query => query.select('id', 'warehouse_name', 'warehouse_address', 'business_name', 'gst_no')
        }
      ]
    });

    if (!order) {
      return res.serverError(404, ErrorHandler("Order not found"));
    }

    const item_order_id = order.get('item_order_id');

    const items = await OrderItem.where({ item_order_id }).fetchAll({ require: false });
    const itemData = items.toJSON();
    const variantIds = itemData.map(item => item.item_variants_id).filter(Boolean);

    const variants = await Variant.query(qb => {
      qb.whereIn('id', variantIds);
    }).fetchAll({ require: false });

    const variantsMap = {};
    variants.toJSON().forEach(variant => {
      variantsMap[variant.id] = variant;
    });

    const itemsWithVariants = await Promise.all(
      itemData.map(async item => {
        const variant = variantsMap[item.item_variants_id] || {};
        let productImage = null;
        let childCategory = null;
        let subCategory = null;
        let category = null;

        if (variant.item_id) {
          const product = await Product.where({ id: variant.item_id }).fetch({
            require: false,
            withRelated: [{
              'product_child_category_id': q => q.select('id', 'product_child_category_name', 'Product_sub_category_id')
            }]
          });

          const childCat = product?.related('product_child_category_id');
          childCategory = childCat?.toJSON() || null;

          if (childCat?.get('Product_sub_category_id')) {
            const subCat = await ProductSubCategory.where({
              id: childCat.get('Product_sub_category_id')
            }).fetch({ require: false, columns: ['id', 'product_sub_category_name', 'Product_category_id'] });

            subCategory = subCat?.toJSON() || null;

            if (subCat?.get('Product_category_id')) {
              const cat = await ProductCategory.where({
                id: subCat.get('Product_category_id')
              }).fetch({ require: false, columns: ['id', 'category_name'] });

              category = cat?.toJSON() || null;
            }
          }

          const attachment = await Attachment.where({
            entity_id: variant.item_id,
            entity_type: 'product_image',
            active_status: 'active'
          }).fetch({ require: false });

          productImage = attachment ? attachment.get('photo_path') : null;
        }


        return {
          ...item,
          variant: {
            ...variant,
            product_image: productImage,
            product_child_category: childCategory,
            product_sub_category: subCategory,
            product_category: category
          }
        };
      })
    );

    const discounts = await Discount.where({ item_order_id }).fetchAll({ require: false });
    const otherCharges = await OtherCharges.where({ item_order_id }).fetchAll({ require: false });

    const image = await Attachment.where({
      entity_id: id,
      entity_type: 'order_image',
      active_status: 'active'
    }).fetch({ require: false });

    const fullOrder = {
      ...order.toJSON(),
      order_image: image ? image.get('photo_path') : null,
      order_items: itemsWithVariants,
      discounts: discounts.toJSON(),
      other_charges: otherCharges.toJSON()
    };

    return res.success({
      success: true,
      message: 'Order fetched successfully',
      order: fullOrder
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};





