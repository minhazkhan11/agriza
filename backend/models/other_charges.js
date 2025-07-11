const bookshelf = require('../config/bookshelf');

const Othercharges = bookshelf.Model.extend({
  tableName: 'Other_charges',
  hasTimestamps: true,
  autoIncrement: true,


  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Other_charges', Othercharges);