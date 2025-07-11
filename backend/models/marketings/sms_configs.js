const bookshelf = require('../config/bookshelf');

const sms_config = bookshelf.Model.extend({
  tableName: 'Sms_config',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Sms_config', sms_config);