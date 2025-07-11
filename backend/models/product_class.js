const bookshelf = require('../config/bookshelf');

const ProductClass = bookshelf.Model.extend({
  tableName: 'Product_class',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  },


});

module.exports = bookshelf.model('Product_class', ProductClass);
