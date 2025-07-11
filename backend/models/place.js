const bookshelf = require('../config/bookshelf');

const Place = bookshelf.Model.extend({
  tableName: 'Place',
  hasTimestamps: true,
  autoIncrement: true,


  pin: function () {
    return this.belongsTo("Pin", "pin_id");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Place', Place);