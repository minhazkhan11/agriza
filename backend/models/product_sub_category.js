const bookshelf = require('../config/bookshelf');

const ProductCategory = bookshelf.Model.extend({
  tableName: 'Product_sub_category',
  hasTimestamps: true,
  autoIncrement: true,

  Product_category_id: function () {
    return this.belongsTo('Product_category', 'Product_category_id');
  },
  sub_category_image: function () {
    return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "sub_category_image");
  },
  addedBy: function () {
    return this.belongsTo('Users', 'added_by');
  },
});

module.exports = bookshelf.model('Product_sub_category', ProductCategory);