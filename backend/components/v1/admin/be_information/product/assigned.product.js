'use strict';

const { ErrorHandler, processAttachment } = require('../../../../../lib/utils');
const Product = require('../../../../../models/product');
const { constants } = require('../../../../../config');
const Attachments = require('../../../../../models/attachments');
const Units = require('../../../../../models/units');
const Assigned = require('../../../../../models/assigned_to');
const Catalogue = require('../../../../../models/product_catalogue');

module.exports = async (req, res, next) => {
  try {

    const assignedRecord = await Assigned.where({ user_id: req.user.id }).fetch({ require: false });

    if (!assignedRecord) {
      return res.serverError(400, ErrorHandler("No assigned entity found for this user."));
    }

    const beInformationId = assignedRecord.get('be_information_id');

    const catalogues = await Catalogue.where({ be_information_id: beInformationId }).fetchAll({ require: false });


    let catalogueProductIds = [];

    if (catalogues) {
      catalogueProductIds = catalogues
        .filter(cat => cat.get('active_status') === constants.activeStatus.active)
        .map(cat => cat.get('Product_id'))
        .filter(id => Number.isInteger(id));
    }

    console.log("Excluded Product IDs:", catalogueProductIds);

    const productsQuery = Product.query((qb) => {
      qb.where('active_status', constants.activeStatus.active);
      if (catalogueProductIds.length > 0) {
        qb.whereNotIn('id', catalogueProductIds);
      }
      qb.orderBy('created_at', 'asc');
    });

    const products = await productsQuery.fetchAll({
      require: false,
      withRelated: [
        { 'product_category_id': (query) => query.select('id', 'category_name') },
        { 'product_class_id': (query) => query.select('id', 'class_name') },
        { 'product_sub_category_id': (query) => query.select('id', 'product_sub_category_name') },
        { 'brands_id': (query) => query.select('id', 'brand_name') },
        { 'marketers_id': (query) => query.select('id', 'marketer_name') }
      ],
    });

    let filteredProducts = [];

    for (const product of products) {
      let productData = product.toJSON();
      productData.images = [];


      let attachments = await Attachments.where({
        entity_id: product.id,
        entity_type: 'Products',
        active_status: constants.activeStatus.active
      }).fetchAll({ require: false });

      if (attachments) {
        productData.images = attachments.map(att => processAttachment(att.toJSON()));
      }

      const fetchUnit = async (unitId) => {
        if (!unitId || isNaN(unitId) || unitId.toString().trim() === "") return null;
        const unit = await Units.where({ id: parseInt(unitId, 10) }).fetch({ require: false, columns: ['id', 'unit_name'] });
        return unit ? unit.toJSON() : null;
      };

      productData.primary_unit = await fetchUnit(productData.primary_unit_id);
      productData.secondary_unit = await fetchUnit(productData.secondary_unit_id);

      delete productData.primary_unit_id;
      delete productData.secondary_unit_id;

      filteredProducts.push(productData);
    }
    const count = filteredProducts.length
    // **Final Response**
    return res.success({
      success: true,
      products: filteredProducts,
      count
    });

  } catch (error) {
    console.error("Error:", error);
    return res.serverError(500, ErrorHandler(error));
  }
};