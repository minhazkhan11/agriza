const bookshelf = require('../config/bookshelf');

const Lead_subCategory = bookshelf.Model.extend({
  tableName: 'Lead_sub_category',
  hasTimestamps: true,
  autoIncrement: true,

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  },
  lead_category: function () {
    return this.belongsTo("Lead_category", "lead_category_id");
  }
});

module.exports = bookshelf.model('Lead_sub_category', Lead_subCategory);