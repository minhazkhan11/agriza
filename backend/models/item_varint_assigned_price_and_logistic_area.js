const bookshelf = require('../config/bookshelf');

const Price_and_logistic_area = bookshelf.Model.extend({
  tableName: 'Item_varint_assigned_price_and_logistic_area',
  hasTimestamps: true,
  autoIncrement: true,


  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Item_varint_assigned_price_and_logistic_area', Price_and_logistic_area);