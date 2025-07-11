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
      qb.whereIn('active_status', [constants.activeStatus.active])
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
      productData.product_image = null; // Default value if no image is found

      // **Fetch Attachments**
      let attachments = await Attachments.where({
        entity_id: product.id,
        entity_type: 'product_image', // Ensure this matches the stored entity_type
        active_status: constants.activeStatus.active
      }).fetchAll({ require: false });

      if (attachments && attachments.length > 0) {
        let firstAttachment = attachments.toJSON()[0]; // Get only the first image
        productData.product_image = processAttachment(firstAttachment); // Assign single image URL
      }

      // Function to safely fetch unit details
      const fetchUnit = async (unitId) => {
        if (!unitId || isNaN(unitId) || unitId.toString().trim() === "") return null;
        const unit = await Units.where({ id: parseInt(unitId, 10) }).fetch({ require: false, columns: ['id', 'unit_name'] });
        return unit ? unit.toJSON() : null;
      };

      // Fetch primary and secondary unit details
      productData.primary_unit = await fetchUnit(productData.primary_unit_id);
      productData.secondary_unit = await fetchUnit(productData.secondary_unit_id);


      // **Fetch added_by user details (full_name)**
      let addedByUser = await User.where({ id: productData.added_by })
        .fetch({ require: false, columns: ['id', 'full_name'] });
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