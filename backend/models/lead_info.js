const bookshelf = require('../config/bookshelf');

const Leads_info = bookshelf.Model.extend({
  tableName: 'Leads_info',
  hasTimestamps: true,
  autoIncrement: true,



  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  },
  product_master_id: function () {
    return this.belongsTo("Product", "product_master_id");
  }
});

module.exports = bookshelf.model('Leads_info', Leads_info);