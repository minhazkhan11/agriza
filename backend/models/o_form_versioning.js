const bookshelf = require('../config/bookshelf');

const Versioning = bookshelf.Model.extend({
  tableName: 'O_form_versioning',
  hasTimestamps: true,
  autoIncrement: true,


  license_id: function () {
    return this.belongsTo("Be_license_details", "license_id");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('O_form_versioning', Versioning);