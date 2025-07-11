const bookshelf = require('../config/bookshelf');

const business_information = bookshelf.Model.extend({
  tableName: 'Be_area_information',
  hasTimestamps: true,
  autoIncrement: true,

  be_information_id: function () {
    return this.belongsTo("Be_information", "be_information_id");
  },
  
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Be_area_information', business_information);