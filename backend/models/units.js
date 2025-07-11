const bookshelf = require('../config/bookshelf');

const Units = bookshelf.Model.extend({
  tableName: 'Units',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Units', Units);