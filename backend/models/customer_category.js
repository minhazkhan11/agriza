


const bookshelf = require('../config/bookshelf');

const Customercategory = bookshelf.Model.extend({
  tableName: 'Customer_category',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Customer_category', Customercategory);