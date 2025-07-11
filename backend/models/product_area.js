const bookshelf = require('../config/bookshelf');

const Product_area = bookshelf.Model.extend({
  tableName: 'product_area',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  },
  marketer: function () {
    return this.belongsTo("marketers", "marketer_id");
  }
});

module.exports = bookshelf.model('product_area', Product_area);