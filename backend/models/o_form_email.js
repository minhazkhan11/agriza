const bookshelf = require('../config/bookshelf');

const Email = bookshelf.Model.extend({
  tableName: 'O_Form_email_data',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('O_Form_email_data', Email);