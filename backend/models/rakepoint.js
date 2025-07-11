const bookshelf = require('../config/bookshelf');

const RackPoint = bookshelf.Model.extend({
  tableName: 'Rack_point',
  hasTimestamps: true,
  autoIncrement: true,


  place_id: function () {
    return this.belongsTo("Place", "place_id");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Rack_point', RackPoint);