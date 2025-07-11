const bookshelf = require('../config/bookshelf');

const Businessareateritary = bookshelf.Model.extend({
  tableName: 'Business_area_teritary',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Business_area_teritary', Businessareateritary);