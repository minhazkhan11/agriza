const bookshelf = require('../config/bookshelf');

const State = bookshelf.Model.extend({
  tableName: 'State',
  hasTimestamps: true,
  autoIncrement: true,


  country: function () {
    return this.belongsTo("Country", "country_id");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('State', State);