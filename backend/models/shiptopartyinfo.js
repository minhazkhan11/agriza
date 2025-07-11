const bookshelf = require('../config/bookshelf');

const ShipInfo = bookshelf.Model.extend({
  tableName: 'ShipInfo',
  hasTimestamps: true,
  autoIncrement: true,

  
  ship_id: function () {
    return this.belongsTo("Pin", "pincode_id");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  },
  license_image: function () {
    return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "license_image");
  },

});

module.exports = bookshelf.model('ShipInfo', ShipInfo);