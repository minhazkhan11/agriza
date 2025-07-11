
const bookshelf = require('../config/bookshelf');

const ItemVariants = bookshelf.Model.extend({
  tableName: 'Item_Variants',
  hasTimestamps: true,
  autoIncrement: true,


  item_id: function () {
    return this.belongsTo("Product", "item_id");
  },
  primary_unit_id: function () {
    return this.belongsTo("Units", "primary_unit_id");
  },
  secondary_unit_id: function () {
    return this.belongsTo("Units", "secondary_unit_id");
  },
  covering_unit_id: function () {
    return this.belongsTo("Units", "covering_unit_id");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Item_Variants', ItemVariants);
