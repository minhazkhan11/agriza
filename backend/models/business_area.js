const bookshelf = require('../config/bookshelf');

const Businessarea = bookshelf.Model.extend({
  tableName: 'Business_area',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  },
  // teritari: function () {
  //   return this.belongsTo("Business_area_teritary", "teritari_ids");
  // }
});

module.exports = bookshelf.model('Business_area', Businessarea);