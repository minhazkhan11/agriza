const bookshelf = require('../config/bookshelf');

const Staff_assigned = bookshelf.Model.extend({
  tableName: 'Staff_assigned',
  hasTimestamps: true,
  autoIncrement: true,



  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Staff_assigned', Staff_assigned);