const Product = require('../../../../../models/product');
const { ErrorHandler } = require('../../../../../lib/utils');

module.exports = async (req, res) => {
  try {
    let { product_category_id, product_sub_category_id, product_child_category_id } = req.params;

    // Convert params to integers (or set them to null if not provided)
    product_category_id = product_category_id ? parseInt(product_category_id, 10) : null;
    product_sub_category_id = product_sub_category_id ? parseInt(product_sub_category_id, 10) : null;
    product_child_category_id = product_child_category_id ? parseInt(product_child_category_id, 10) : null;

    // Ensure at least one filter is provided
    if (!product_category_id && !product_sub_category_id && !product_child_category_id) {
      return res.serverError(400, ErrorHandler("At least one filter (product_category_id, product_sub_category_id, or product_child_category_id) is required."));
    }

    // Build query dynamically
    let query = Product.where({ active_status: 'active' });

    if (product_category_id) {
      query = query.where({ product_category_id });
    }
    if (product_sub_category_id) {
      query = query.where({ product_sub_category_id });
    }
    if (product_child_category_id) {
      query = query.where({ product_child_category_id });
    }

    // Fetch products (limit to 30)
    const products = await query.orderBy('id', 'asc').fetchAll({ require: false, columns: ['id', 'product_name'], limit: 30 });

    return res.success({
      products: products.toJSON(),
      count: products.length
    });

  } catch (error) {
    console.error("Database Query Error:", error);
    return res.serverError(500, ErrorHandler(error));
  }
};
