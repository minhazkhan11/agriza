

const bookshelf = require('../config/bookshelf');

const Beassigned = bookshelf.Model.extend({
  tableName: 'Be_gst_person_assigned',
  hasTimestamps: true,
  autoIncrement: true,


  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }

});

module.exports = bookshelf.model('Be_gst_person_assigned', Beassigned);