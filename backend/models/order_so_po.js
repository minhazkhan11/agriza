const bookshelf = require('../config/bookshelf');

const ordersopo = bookshelf.Model.extend({
  tableName: 'Order',
  hasTimestamps: true,
  autoIncrement: true,
  order_image: function () {
    return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "order_image");
  },
  customer_be: function () {
    return this.belongsTo("Be_information", "customer_be_id");
  },
  vendor_be: function () {
    return this.belongsTo("Be_information", "vendor_be_id");
  },
  warehouse: function () {
    return this.belongsTo("Be_warehouse_information", "warehouse_information_id");
  },
  customer_ship_to_party: function () {
    return this.belongsTo("Delivery_Point", "customer_ship_to_party_id");
  },
  vendor_warehouse: function () {
    return this.belongsTo("Be_warehouse_information", "vendor_warehouse_information_id");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Order', ordersopo);