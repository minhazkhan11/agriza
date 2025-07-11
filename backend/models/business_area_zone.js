const bookshelf = require('../config/bookshelf');

const Businessareazone = bookshelf.Model.extend({
  tableName: 'Business_area_zone',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  },
  region: function () {
    return this.belongsTo("Business_area_region", "region_id");
  }
});

module.exports = bookshelf.model('Business_area_zone', Businessareazone);