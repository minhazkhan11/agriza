const bookshelf = require('../config/bookshelf');

const LicenseProduct = bookshelf.Model.extend({
  tableName: 'License_Product',
  hasTimestamps: true,
  autoIncrement: true,

  be_license_id: function () {
    return this.belongsTo("Be_license_details", "be_license_id");
  },

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('License_Product', LicenseProduct);