const bookshelf = require('../config/bookshelf');

const Bookdemo = bookshelf.Model.extend({
  tableName: 'book_a_demo',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('book_a_demo', Bookdemo);