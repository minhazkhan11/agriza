
const bookshelf = require('../config/bookshelf');

const be_gst_details = bookshelf.Model.extend({
  tableName: 'Be_gst_details',
  hasTimestamps: true,
  autoIncrement: true,
  pin_id: function () {
    return this.belongsTo("Pin", "pin_id");
  },
  place_id: function () {
    return this.belongsTo("Place", "place_id");
  },
  be_information_id: function () {
    return this.belongsTo("Be_information", "be_information_id");
  },
  gst_file: function () {
    return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "gst_file");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Be_gst_details', be_gst_details);