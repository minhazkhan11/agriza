const bookshelf = require('../config/bookshelf');

const Category = bookshelf.Model.extend({
  tableName: 'Business_category',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Business_category', Category);