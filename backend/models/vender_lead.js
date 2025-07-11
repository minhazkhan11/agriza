const bookshelf = require('../config/bookshelf');

const Vender = bookshelf.Model.extend({
  tableName: 'Vender_lead',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Vender_lead', Vender);