const bookshelf = require('../config/bookshelf');

const Tehsil = bookshelf.Model.extend({
  tableName: 'Tehsil',
  hasTimestamps: true,
  autoIncrement: true,


  district: function () {
    return this.belongsTo("District", "district_id");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Tehsil', Tehsil);