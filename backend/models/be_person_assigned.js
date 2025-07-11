

const bookshelf = require('../config/bookshelf');

const Beassigned = bookshelf.Model.extend({
  tableName: 'Be_person_assigned',
  hasTimestamps: true,
  autoIncrement: true,

  // be_information_id: function () {
  //   return this.belongsTo("Be_information", "be_information_id");
  // },
  // pincode_id: function () {
  //   return this.belongsTo("Pin", "pincode_id");
  // },
  // place_id: function () {
  //   return this.belongsTo("Place", "place_id");
  // },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }

});

module.exports = bookshelf.model('Be_person_assigned', Beassigned);