const bookshelf = require('../config/bookshelf');

const Lead_Category = bookshelf.Model.extend({
  tableName: 'Lead_category',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Lead_category', Lead_Category);