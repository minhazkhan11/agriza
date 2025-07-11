const bookshelf = require('../config/bookshelf');

const ProductchildCategory = bookshelf.Model.extend({
  tableName: 'Product_child_category',
  hasTimestamps: true,
  autoIncrement: true,

  Product_sub_category_id: function () {
    return this.belongsTo('Product_sub_category', 'Product_sub_category_id');
  },
  child_category_image: function () {
    return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "child_category_image");
  },
  addedBy: function () {
    return this.belongsTo('Users', 'added_by');
  },
});

module.exports = bookshelf.model('Product_child_category', ProductchildCategory);