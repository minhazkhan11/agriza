const bookshelf = require('../config/bookshelf');

const Issue = bookshelf.Model.extend({
  tableName: 'O_form_issue',
  hasTimestamps: true,
  autoIncrement: true,

  lead_id: function () {
    return this.belongsTo("Leads", "lead_id");
  },
  customer_id: function () {
    return this.belongsTo("User", "customer_id");
  },
  o_form_id: function () {
    return this.belongsTo("O_form_versioning", "o_form_id");
  },
  addedBy: function () {
    return this.belongsTo("User", "added_by");
  }
});

module.exports = bookshelf.model('O_form_issue', Issue);