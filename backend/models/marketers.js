const bookshelf = require('../config/bookshelf');

const Marketers = bookshelf.Model.extend({
  tableName: 'marketers',
  hasTimestamps: true,
  autoIncrement: true,

  photo: function () {
    return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "marketer_photo");
  },


  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('marketers', Marketers);