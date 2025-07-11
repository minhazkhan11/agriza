
const bookshelf = require('../config/bookshelf');

const bankdetails = bookshelf.Model.extend({
  tableName: 'Be_identity_table',
  hasTimestamps: true,
  autoIncrement: true,


  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Be_identity_table', bankdetails);