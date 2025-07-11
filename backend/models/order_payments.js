const bookshelf = require('../config/bookshelf');

const Payments = bookshelf.Model.extend({
  tableName: 'Order_Payments',
  hasTimestamps: true,
  autoIncrement: true,


  payments_image: function () {
    return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "payments_image");
  },
  be_information_customer: function () {
    return this.belongsTo("Be_information", "customer_be_id");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Order_Payments', Payments);