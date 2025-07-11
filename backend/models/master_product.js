const bookshelf = require('../config/bookshelf');

const master_products = bookshelf.Model.extend({
  tableName: 'master_product',
  hasTimestamps: true,
  autoIncrement: true,



  product_child_category_id: function () {
    return this.belongsTo("Product_child_category", "product_child_category_id");
  },
  gst_id: function () {
    return this.belongsTo("GST_percent", "gst_id");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('master_product', master_products);