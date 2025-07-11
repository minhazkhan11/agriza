const bookshelf = require('../config/bookshelf');

const Dispatch = bookshelf.Model.extend({
  tableName: 'Order_dispatch',
  hasTimestamps: true,
  autoIncrement: true,



  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Order_dispatch', Dispatch);