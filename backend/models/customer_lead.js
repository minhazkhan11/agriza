const bookshelf = require('../config/bookshelf');

const Customer = bookshelf.Model.extend({
  tableName: 'Customer_lead',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Customer_lead', Customer);