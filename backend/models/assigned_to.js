const bookshelf = require('../config/bookshelf');

const Assigned = bookshelf.Model.extend({
  tableName: 'Assigned_to',
  hasTimestamps: true,
  autoIncrement: true,



  be_information_id: function () {
    return this.belongsTo("Be_information", "be_information_id");
  },
  user_id: function () {
    return this.belongsTo("Users", "user_id");
  },

  // bank_details: function () {
  //   return this.hasOne("business_bank_details", "be_information_id", "be_information_id");
  // },

  photo: function () {
    return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "photo");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Assigned_to', Assigned);