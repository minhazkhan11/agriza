
const bookshelf = require('../config/bookshelf');

const godowndetails = bookshelf.Model.extend({
  tableName: 'GodownAddress',
  hasTimestamps: true,
  autoIncrement: true,

  license_id: function () {
    return this.belongsTo("Be_license_details", "license_id");
  },
  pincode_id: function () {
    return this.belongsTo("Pin", "pincode_id");
  },
  place_id: function () {
    return this.belongsTo("Place", "place_id");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('GodownAddress', godowndetails);