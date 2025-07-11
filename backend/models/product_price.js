const bookshelf = require('../config/bookshelf');

const ProductClass = bookshelf.Model.extend({
  tableName: 'Product_price',
  hasTimestamps: true,
  autoIncrement: true,

  Product_id: function () {
    return this.belongsTo("Product", "Product_id");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  },


});

module.exports = bookshelf.model('Product_price', ProductClass);
