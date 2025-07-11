const bookshelf = require('../config/bookshelf');

const Variants = bookshelf.Model.extend({
  tableName: 'Variants',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  },
  attribute_id: function () {
    return this.belongsTo("Attributes", "attribute_id");
  }
});

module.exports = bookshelf.model('Variants', Variants);