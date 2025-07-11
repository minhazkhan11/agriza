'use strict';
const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
const Product = require('../../../../../models/product');
const { constants } = require('../../../../../config');
const Attachments = require('../../../../../models/attachments');
const Units = require('../../../../../models/units');
const User = require('../../../../../models/users')


module.exports = async (req, res, next) => {
  try {
    const products = await Product.query((qb) => {
      qb.whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive, constants.activeStatus.pending, constants.activeStatus.cancelled])
        .andWhereNot('added_by', 1)
        .orderBy('created_at', 'asc');
    }).fetchAll({
      require: false,
      withRelated: [{
        'product_category_id': function (query) {
          query.select('id', 'category_name');
        }
      },
      {
        'product_class_id': function (query) {
          query.select('id', 'class_name');
        }
      }, {
        'product_sub_category_id': function (query) {
          query.select('id', 'product_sub_category_name');
        }
      }, {
        'brands_id': function (query) {
          query.select('id', 'brand_name');
        }
      },
      {
        'marketers_id': function (query) {
          query.select('id', 'marketer_name');
        }
      }
      ],

    });

    let newProduct = [];
    for (const product of products) {
      let productData = product.toJSON();

      productData.images = {};

      let attachments = await Attachments.where({
        entity_id: product.id,
        entity_type: 'Products',
        active_status: constants.activeStatus.active
      }).fetchAll({ require: false });

      let attachmentArray = [];

      if (attachments) {
        for (const attachment of attachments) {
          let attachmentJson = attachment.toJSON();

          const image_url = processAttachment(attachmentJson);
          attachmentArray.push(image_url);
        }
      }

      productData.images = attachmentArray;
      // Fetch primary and secondary unit details with only 'id' and 'unit_name' fields
      let primaryUnit = await Units.where({ id: productData.primary_unit_id })
        .fetch({ require: false, columns: ['id', 'unit_name'] });

      let secondaryUnit = await Units.where({ id: productData.secondary_unit_id })
        .fetch({ require: false, columns: ['id', 'unit_name'] });

      // **Fetch added_by user details (full_name)**
      let addedByUser = await User.where({ id: productData.added_by })
        .fetch({ require: false, columns: ['id', 'full_name'] });

      productData.primary_unit = primaryUnit ? primaryUnit.toJSON() : null;
      productData.secondary_unit = secondaryUnit ? secondaryUnit.toJSON() : null;


      productData.user_name = addedByUser ? addedByUser.get('full_name') : null;

      // Remove unnecessary fields from response
      delete productData.primary_unit_id;
      delete productData.secondary_unit_id;


      newProduct.push(productData);
    }


    const count = newProduct.length;

    return res.success({
      newProduct, count
    });

  } catch (error) {
    return res.serverError(500, ErrorHandler(error));
  }
};