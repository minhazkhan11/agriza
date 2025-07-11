const bookshelf = require('../config/bookshelf');

const License_cate = bookshelf.Model.extend({
  tableName: 'License_category',
  hasTimestamps: true,
  autoIncrement: true,




  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('License_category', License_cate);