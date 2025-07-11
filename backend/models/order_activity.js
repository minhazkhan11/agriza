const bookshelf = require('../config/bookshelf');

const follow_up = bookshelf.Model.extend({
  tableName: 'Activity',
  hasTimestamps: true,
  autoIncrement: true,



  activity_image: function () {
    return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "activity_image");
  },
  be_information_customer: function () {
    return this.belongsTo("Be_information", "customer_be_id");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Activity', follow_up);