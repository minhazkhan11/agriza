const bookshelf = require('../config/bookshelf');

const Businessarearegion = bookshelf.Model.extend({
  tableName: 'Business_area_region',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  },
  // area: function () {
  //   return this.belongsTo("Business_area", "area_id");
  // }
});

module.exports = bookshelf.model('Business_area_region', Businessarearegion);