const bookshelf = require('../config/bookshelf');

const Ship = bookshelf.Model.extend({
  tableName: 'Delivery_Point',
  hasTimestamps: true,
  autoIncrement: true,


  pincode_id: function () {
    return this.belongsTo("Pin", "pincode_id");
  },
  place_id: function () {
    return this.belongsTo("Place", "place_id");
  },
  gst_id: function () {
    return this.belongsTo("Be_gst_details", "gst_id");
  },
  customer: function () {
    return this.belongsTo("User", "added_by");
  }

});

module.exports = bookshelf.model('Delivery_Point', Ship);