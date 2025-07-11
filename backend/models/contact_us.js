const bookshelf = require('../config/bookshelf');

const Contact = bookshelf.Model.extend({
  tableName: 'contact_us',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('contact_us', Contact);