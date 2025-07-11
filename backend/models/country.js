const bookshelf = require('../config/bookshelf');

const Country = bookshelf.Model.extend({
  tableName: 'Country',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Country', Country);