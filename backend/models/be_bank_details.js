
const bookshelf = require('../config/bookshelf');

const bankdetails = bookshelf.Model.extend({
  tableName: 'Be_bank_details',
  hasTimestamps: true,
  autoIncrement: true,

  be_information_id: function () {
    return this.belongsTo("Be_information", "be_information_id");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Be_bank_details', bankdetails);