const bookshelf = require('../config/bookshelf');

const Assigned_item = bookshelf.Model.extend({
  tableName: 'Assigned_item_variants_to_vendor',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  },
  vendor_be_id: function () {
    return this.belongsTo("Be_information", "vendor_be_id");
  },
  item_variants_id: function () {
    return this.belongsTo("Item_Variants", "item_variants_id");
  }
});

module.exports = bookshelf.model('Assigned_item_variants_to_vendor', Assigned_item);