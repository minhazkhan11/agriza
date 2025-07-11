const bookshelf = require('../config/bookshelf');

const Product = bookshelf.Model.extend({
  tableName: 'Product',
  hasTimestamps: true,
  autoIncrement: true,

  product_category_id: function () {
    return this.belongsTo("Product_category", "product_category_id");
  },
  product_sub_category_id: function () {
    return this.belongsTo("Product_sub_category", "product_sub_category_id");
  },
  marketers_id: function () {
    return this.belongsTo("marketers", "marketers_id");
  },
  product_class_id: function () {
    return this.belongsTo("Product_class", "product_class_id");
  },
  brands_id: function () {
    return this.belongsTo("brands", "brands_id");
  },
  added_by: function () {
    return this.belongsTo("Users", "added_by");
  },
  category: function () {
    return this.belongsTo("Business_category", "category_id");
  },
  gst_percent_id: function () {
    return this.belongsTo("GST_percent", "gst_percent_id");
  },
  product_child_category_id: function () {
    return this.belongsTo("Product_child_category", "product_child_category_id");
  },
  master_product_id: function () {
    return this.belongsTo("master_product", "master_product_id");
  },
  // attachment: function () {
  //   return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "Product");
  // },
  product_image: function () {
    return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "product_image");
  },
});

module.exports = bookshelf.model('Product', Product);

