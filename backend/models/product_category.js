const bookshelf = require('../config/bookshelf');

const ProductCategory = bookshelf.Model.extend({
  tableName: 'Product_category',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo('Users', 'added_by');
  },
});

module.exports = bookshelf.model('Product_category', ProductCategory);
