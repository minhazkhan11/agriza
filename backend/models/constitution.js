const bookshelf = require('../config/bookshelf');

const constitution = bookshelf.Model.extend({
  tableName: 'Constitution',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Constitution', constitution);