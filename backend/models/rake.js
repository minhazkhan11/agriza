const bookshelf = require('../config/bookshelf');

const Rake = bookshelf.Model.extend({
  tableName: 'Rake',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  },
  warehouse_id: function () {
    return this.belongsTo("Be_warehouse_information", "warehouse_id");
  }
});

module.exports = bookshelf.model('Rake', Rake);