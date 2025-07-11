const bookshelf = require('../config/bookshelf');

const SubExpense = bookshelf.Model.extend({
  tableName: 'Sub_Expense',
  hasTimestamps: true,
  autoIncrement: true,

  expense_photo: function () {
    return this.morphOne("Attachments", "attachment", ["entity_type", "entity_id"], "expense_photo");
  },
  expense_id: function () {
    return this.belongsTo("Expense", "expense_id");
  },
  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Sub_Expense', SubExpense);