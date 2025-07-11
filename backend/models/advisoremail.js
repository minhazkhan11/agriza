const bookshelf = require('../config/bookshelf');

const AdvisorEmail = bookshelf.Model.extend({
  tableName: 'AdvisorEmail',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('AdvisorEmail', AdvisorEmail);