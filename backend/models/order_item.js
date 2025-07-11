const bookshelf = require('../config/bookshelf');

const Orderitem = bookshelf.Model.extend({
  tableName: 'Order_item',
  hasTimestamps: true,
  autoIncrement: true,


  item_variants: function () {
    return this.belongsTo("Item_Variants", "item_variants_id");
  }
  
  ,
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Order_item', Orderitem);