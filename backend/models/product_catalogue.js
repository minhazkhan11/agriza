const bookshelf = require('../config/bookshelf');

const catalogue = bookshelf.Model.extend({
  tableName: 'product_catalogue',
  hasTimestamps: true,
  autoIncrement: true,
  be_information_id: function () {
    return this.belongsTo("Be_information", "be_information_id");
  },
  Product_id: function () {
    return this.belongsTo('Product', 'Product_id');
  },

  addedBy: function () {
    return this.belongsTo('Users', 'added_by');
  },
});

module.exports = bookshelf.model('product_catalogue', catalogue);
