const bookshelf = require('../config/bookshelf');

const Business_Entity_Basic = bookshelf.Model.extend({
  tableName: 'Be_information',
  hasTimestamps: true,
  autoIncrement: true,

  constitutions_id: function () {
    return this.belongsTo("Constitution", "constitutions_id");
  },
  postal_pincode_id: function () {
    return this.belongsTo("Pin", "postal_pincode_id");
  },
  gst_pincode_id: function () {
    return this.belongsTo("Pin", "gst_pincode_id");
  },
  postal_place_id: function () {
    return this.belongsTo("Place", "postal_place_id");
  },
  gst_place_id: function () {
    return this.belongsTo("Place", "gst_place_id");
  },
  logo: function () {
    return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "logo");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Be_information', Business_Entity_Basic);