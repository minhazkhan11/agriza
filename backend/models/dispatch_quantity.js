const bookshelf = require('../config/bookshelf');

const quantity = bookshelf.Model.extend({
  tableName: 'Dispatch_quantity',
  hasTimestamps: true,
  autoIncrement: true,



  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Dispatch_quantity', quantity);