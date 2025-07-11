
const bookshelf = require('../config/bookshelf');

const licensedetails = bookshelf.Model.extend({
  tableName: 'Be_license_details_old',
  hasTimestamps: true,
  autoIncrement: true,

  be_information_id: function () {
    return this.belongsTo("Be_information", "be_information_id");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  },
  signature: function () {
    return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "signature");
  },
  seal: function () {
    return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "seal");
  },
  license: function () {
    return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "license");
  },
});

module.exports = bookshelf.model('Be_license_details_old', licensedetails);