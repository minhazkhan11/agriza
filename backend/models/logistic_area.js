const bookshelf = require('../config/bookshelf');

const Logistic_area = bookshelf.Model.extend({
  tableName: 'Logistic_area',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Logistic_area', Logistic_area);