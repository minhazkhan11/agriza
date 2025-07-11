const bookshelf = require('../config/bookshelf');

const GST = bookshelf.Model.extend({
  tableName: 'GST_percent',
  hasTimestamps: true,
  autoIncrement: true,



  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('GST_percent', GST);