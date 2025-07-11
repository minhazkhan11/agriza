const bookshelf = require('../config/bookshelf');

const Category = bookshelf.Model.extend({
  tableName: 'Business_sub_category',
  hasTimestamps: true,
  autoIncrement: true,


  business_category_id: function () {
    return this.belongsTo("Business_category", "business_category_id");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Business_sub_category', Category);