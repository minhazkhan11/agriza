
const bookshelf = require('../config/bookshelf');

const licensedetails = bookshelf.Model.extend({
  tableName: 'Be_license_details',
  hasTimestamps: true,
  autoIncrement: true,

  license_category: function () {
    return this.belongsTo("License_category", "license_category_id");
  },
  pin_code: function () {
    return this.belongsTo("Pin", "pin_code");
  },
  place_id: function () {
    return this.belongsTo("Place", "place_id");
  },
  state: function () {
    return this.belongsTo("State", "state");
  },
  district: function () {
    return this.belongsTo("District", "district");
  },
  tehsil: function () {
    return this.belongsTo("Tehsil", "tehsil");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  },
  signatureandseal: function () {
    return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "signatureandseal");
  },
  seal: function () {
    return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "seal");
  }
  ,
  license: function () {
    return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "license");
  }
});

module.exports = bookshelf.model('Be_license_details', licensedetails);