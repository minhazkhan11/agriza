const bookshelf = require('../config/bookshelf');

const Uqc = bookshelf.Model.extend({
  tableName: 'UQc_data',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('UQc_data', Uqc);