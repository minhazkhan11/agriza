'use strict';

const { ErrorHandler } = require('../../../../../../lib/utils');
const Productprice = require('../../../../../../models/product_price');
const { constants } = require('../../../../../../config');

module.exports = async (req, res) => {
  try {
    let productPrices = req.body.product_price; // Expecting an array
    if (!Array.isArray(productPrices)) {
      return res.serverError(400, { error: "Invalid data format. Expected an array of product_price." });
    }

    let insertedRecords = [];

    for (let product of productPrices) {
      product.added_by = req.user.id; // Set added_by for each product price
      const newProductPrice = await new Productprice(product).save();
      insertedRecords.push(newProductPrice);
    }

    return res.success({
      message: "Product prices added successfully",
      product_prices: insertedRecords
    });

  } catch (error) {
    console.error("Error:", error);
    return res.serverError(500, { error: ErrorHandler(error) });
  }
};

