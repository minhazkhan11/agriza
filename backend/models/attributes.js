const bookshelf = require('../config/bookshelf');

const Attributes = bookshelf.Model.extend({
  tableName: 'Attributes',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Attributes', Attributes);