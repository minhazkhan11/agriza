const bookshelf = require('../config/bookshelf');

const Tehsil = bookshelf.Model.extend({
  tableName: 'Suppliers',
  hasTimestamps: true,
  autoIncrement: true,


  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Suppliers', Tehsil);