const bookshelf = require('../config/bookshelf');

const Totaldiscount = bookshelf.Model.extend({
  tableName: 'Total_discount',
  hasTimestamps: true,
  autoIncrement: true,


  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Total_discount', Totaldiscount);