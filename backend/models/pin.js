const bookshelf = require('../config/bookshelf');

const Pin = bookshelf.Model.extend({
  tableName: 'Pin',
  hasTimestamps: true,
  autoIncrement: true,


  tehsil: function () {
    return this.belongsTo("Tehsil", "tehsil_id");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Pin', Pin);