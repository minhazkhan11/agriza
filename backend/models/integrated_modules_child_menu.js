const bookshelf = require('../config/bookshelf');

const child_menu = bookshelf.Model.extend({
  tableName: 'Integrated_modules_child_menu',
  hasTimestamps: true,
  autoIncrement: true,

  sub_menu_id: function () {
    return this.belongsTo("Integrated_modules_sub_menu", "sub_menu_id");
  },

  addedBy: function () {
    return this.belongsTo("Users", "added_by");
  }
});

module.exports = bookshelf.model('Integrated_modules_child_menu', child_menu);