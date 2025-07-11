
const bookshelf = require('../config/bookshelf');

const VariantsStock = bookshelf.Model.extend({
  tableName: 'Item_Variants_stock',
  hasTimestamps: true,
  autoIncrement: true,
  
  item_variants_id: function () {
    return this.belongsTo("Item_Variants", "item_variants_id");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Item_Variants_stock', VariantsStock);