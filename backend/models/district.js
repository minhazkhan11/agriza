const bookshelf = require('../config/bookshelf');

const District = bookshelf.Model.extend({
  tableName: 'District',
  hasTimestamps: true,
  autoIncrement: true,


  country: function () {
    return this.belongsTo("Country", "country_id");
  },
  state: function () {
    return this.belongsTo("State", "state_id");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('District', District);