const bookshelf = require('../config/bookshelf');

const Bepersons = bookshelf.Model.extend({
  tableName: 'Be_persons',
  hasTimestamps: true,
  autoIncrement: true,

  photo: function () {
    return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "photo");
  },
  aadhar_upload: function () {
    return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "aadhar_upload");
  },
  pan_upload: function () {
    return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "pan_upload");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }

});

module.exports = bookshelf.model('Be_persons', Bepersons);