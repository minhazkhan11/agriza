const bookshelf = require('../config/bookshelf');

const expense = bookshelf.Model.extend({
  tableName: 'Expense',
  hasTimestamps: true,
  autoIncrement: true,


  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Expense', expense);