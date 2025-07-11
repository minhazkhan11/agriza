
'use strict';

const { ErrorHandler } = require('../../../../../lib/utils');
const Catalogue = require('../../../../../models/product_catalogue');
const Product = require('../../../../../models/product');
const { constants } = require('../../../../../config');
const Productprice = require('../../../../../models/product_price');

module.exports = async (req, res) => {
  try {
    // Fetch the catalogue for the user
    const catalogue = await Catalogue.query((qb) => {
      qb.where('added_by', req.user.id)
        .whereIn('active_status', [constants.activeStatus.active, constants.activeStatus.inactive])
        .orderBy('created_at', 'asc');
    }).fetchAll({ require: false, columns: ['id', 'be_information_id', 'Product_id', 'active_status'], });

    if (!catalogue || catalogue.isEmpty()) {
      return res.success({ success: true, catalogue: { Product: [] }, count: 0 });
    }

    const catalogueData = catalogue.toJSON();

    // Extract unique Product IDs from catalogue

    const productIds = [...new Set(catalogueData.map(item => item.Product_id))];

    // Fetch all products matching the extracted IDs
    let products = [];
    if (productIds.length > 0) {
      const fetchedProducts = await Product.query(qb => {
        qb.whereIn('id', productIds);
      }).fetchAll({
        require: false,

        withRelated: [
          { 'product_category_id': qb => qb.select('id', 'category_name') },
          { 'product_class_id': qb => qb.select('id', 'class_name') },
          { 'product_sub_category_id': qb => qb.select('id', 'product_sub_category_name') },
          { 'brands_id': qb => qb.select('id', 'brand_name') },
          { 'marketers_id': qb => qb.select('id', 'marketer_name') }
        ],
      });
      products = fetchedProducts ? fetchedProducts.toJSON() : [];
    }
    let productPrices = [];
    if (productIds.length > 0) {
      const fetchedPrices = await Productprice.query(qb => {
        qb.whereIn('Product_id', productIds)
          .orderBy('created_at', 'desc')
      }).fetchAll({ require: false });

      productPrices = fetchedPrices ? fetchedPrices.toJSON() : [];
    }
    // Enrich each catalogue entry with product details
    const enrichedCatalogue = catalogueData.map(item => ({
      ...item,
      product: products.find(p => p.id === item.Product_id) || null,
      price: productPrices.filter(price => price.Product_id === item.Product_id)[0] || null
    }));

    return res.success({
      success: true,
      catalogue: enrichedCatalogue,
      count: enrichedCatalogue.length
    });

  } catch (error) {
    console.error("Error:", error);
    return res.serverError(500, ErrorHandler(error));
  }
};
