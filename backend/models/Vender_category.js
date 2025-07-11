

const bookshelf = require('../config/bookshelf');

const Vendercategory = bookshelf.Model.extend({
  tableName: 'Vender_category',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Vender_category', Vendercategory);